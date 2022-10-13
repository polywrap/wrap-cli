import { Command, Program } from "./types";
import { createLogger } from "./utils/createLogger";
import {
  Compiler,
  PolywrapProject,
  SchemaComposer,
  Watcher,
  WatchEvent,
  watchEventName,
  intlMsg,
  defaultPolywrapManifest,
  parseDirOption,
  parseClientConfigOption,
  parseManifestFileOption,
} from "../lib";
import { CodeGenerator } from "../lib/codegen";
import {
  DockerVMBuildStrategy,
  BuildStrategy,
  SupportedStrategies,
  DockerImageBuildStrategy,
  LocalBuildStrategy,
} from "../lib/build-strategies";

import path from "path";
import readline from "readline";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";
import { getDefaultLogFileName } from "../lib/option-defaults/getDefaultLogFileName";

const defaultOutputDir = "./build";
const defaultStrategy = SupportedStrategies.VM;
const strategyStr = intlMsg.commands_build_options_s_strategy();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");
const pathStr = intlMsg.commands_build_options_o_path();

type BuildCommandOptions = {
  manifestFile: string;
  outputDir: string;
  clientConfig: Partial<PolywrapClientConfig>;
  codegen: boolean; // defaults to true
  watch?: boolean;
  strategy: SupportedStrategies;
  verbose?: boolean;
  quiet?: boolean;
};

export const build: Command = {
  setup: (program: Program) => {
    program
      .command("build")
      .alias("b")
      .description(intlMsg.commands_build_description())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        intlMsg.commands_build_options_m({
          default: defaultManifestStr,
        })
      )
      .option(
        `-o, --output-dir <${pathStr}>`,
        `${intlMsg.commands_build_options_o({
          default: defaultOutputDir,
        })}`
      )
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .option(`-n, --no-codegen`, `${intlMsg.commands_build_options_n()}`)
      .option(
        `-s, --strategy <${strategyStr}>`,
        `${intlMsg.commands_build_options_s()}`,
        defaultStrategy
      )
      .option(`-w, --watch`, `${intlMsg.commands_build_options_w()}`)
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file <${pathStr}>`,
        `${intlMsg.commands_build_options_s()}`,
        getDefaultLogFileName()
      )
      .action(async (options) => {
        await run({
          ...options,
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultPolywrapManifest
          ),
          clientConfig: await parseClientConfigOption(options.clientConfig),
          outputDir: parseDirOption(options.outputDir, defaultOutputDir),
          strategy: options.strategy,
        });
      });
  },
};

async function validateManifestModules(polywrapManifest: PolywrapManifest) {
  if (
    polywrapManifest.project.type !== "interface" &&
    !polywrapManifest.source.module
  ) {
    const missingModuleMessage = intlMsg.lib_compiler_missingModule();
    throw Error(missingModuleMessage);
  }

  if (
    polywrapManifest.project.type === "interface" &&
    polywrapManifest.source.module
  ) {
    const noInterfaceModule = intlMsg.lib_compiler_noInterfaceModule();
    throw Error(noInterfaceModule);
  }
}

function createBuildStrategy(
  strategy: BuildCommandOptions["strategy"],
  outputDir: string,
  project: PolywrapProject
): BuildStrategy {
  switch (strategy) {
    case SupportedStrategies.LOCAL:
      return new LocalBuildStrategy({ outputDir, project });
    case SupportedStrategies.IMAGE:
      return new DockerImageBuildStrategy({ outputDir, project });
    case SupportedStrategies.VM:
      return new DockerVMBuildStrategy({ outputDir, project });
    default:
      throw Error(`Unknown strategy: ${strategy}`);
  }
}

async function run(options: BuildCommandOptions) {
  const {
    watch,
    manifestFile,
    outputDir,
    clientConfig,
    strategy,
    codegen,
    verbose,
    quiet,
  } = options;
  const logger = createLogger({ verbose, quiet });

  // Get Client
  const client = new PolywrapClient(clientConfig);

  const project = new PolywrapProject({
    rootDir: path.dirname(manifestFile),
    polywrapManifestPath: manifestFile,
    logger,
  });
  await project.validate();

  const polywrapManifest = await project.getManifest();
  await validateManifestModules(polywrapManifest);

  const buildStrategy = createBuildStrategy(strategy, outputDir, project);

  const schemaComposer = new SchemaComposer({
    project,
    client,
  });

  const execute = async (): Promise<boolean> => {
    const codeGenerator = codegen
      ? new CodeGenerator({ project, schemaComposer })
      : undefined;

    const compiler = new Compiler({
      project,
      outputDir,
      schemaComposer,
      buildStrategy,
      codeGenerator,
    });

    const result = await compiler.compile();

    if (!result) {
      return result;
    }

    return true;
  };

  if (!watch) {
    const result = await execute();

    if (!result) {
      process.exit(1);
    }
  } else {
    // Execute
    await execute();

    const keyPressListener = () => {
      // Watch for escape key presses
      logger.info(
        `${intlMsg.commands_build_keypressListener_watching()}: ${project.getManifestDir()}`
      );
      logger.info(intlMsg.commands_build_keypressListener_exit());
      readline.emitKeypressEvents(process.stdin);
      process.stdin.on("keypress", async (str, key) => {
        if (
          key.name == "escape" ||
          key.name == "q" ||
          (key.name == "c" && key.ctrl)
        ) {
          await watcher.stop();
          process.kill(process.pid, "SIGINT");
        }
      });

      if (process.stdin.setRawMode) {
        process.stdin.setRawMode(true);
      }

      process.stdin.resume();
    };

    keyPressListener();

    // Watch the directory
    const watcher = new Watcher();

    watcher.start(project.getManifestDir(), {
      ignored: [outputDir + "/**", project.getManifestDir() + "/**/wrap/**"],
      ignoreInitial: true,
      execute: async (events: WatchEvent[]) => {
        // Log all of the events encountered
        for (const event of events) {
          logger.info(`${watchEventName(event.type)}: ${event.path}`);
        }

        // Execute the build
        await execute();

        // Process key presses
        keyPressListener();
      },
    });
  }

  process.exit(0);
}
