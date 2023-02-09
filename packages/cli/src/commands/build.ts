import { Command, Program, BaseCommandOptions } from "./types";
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
  parseLogFileOption,
  getProjectFromManifest,
  isPolywrapManifestLanguage,
  polywrapManifestLanguages,
  pluginManifestLanguages,
  parseWrapperEnvsOption,
} from "../lib";
import { CodeGenerator } from "../lib/codegen";
import {
  DockerVMBuildStrategy,
  BuildStrategy,
  SupportedStrategies,
  DockerImageBuildStrategy,
  LocalBuildStrategy,
} from "../lib/build-strategies";
import { defaultCodegenDir } from "../lib/defaults/defaultCodegenDir";

import readline from "readline";
import { PolywrapClient } from "@polywrap/client-js";
import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";

const defaultOutputDir = "./build";
const defaultStrategy = SupportedStrategies.VM;
const strategyStr = Object.values(SupportedStrategies).join(" | ");
const defaultManifestStr = defaultPolywrapManifest.join(" | ");
const pathStr = intlMsg.commands_build_options_o_path();

const supportedProjectTypes = [
  ...Object.values(polywrapManifestLanguages),
  ...Object.values(pluginManifestLanguages),
];

export interface BuildCommandOptions extends BaseCommandOptions {
  manifestFile: string;
  outputDir: string;
  clientConfig: string | false;
  wrapperEnvs: string | false;
  codegen: boolean; // defaults to false
  codegenDir: string;
  watch: boolean;
  strategy: `${SupportedStrategies}`;
}

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
      .option(`--codegen`, `${intlMsg.commands_build_options_codegen()}`)
      .option(
        `--codegen-dir`,
        `${intlMsg.commands_build_options_codegen_dir({
          default: defaultCodegenDir,
        })}`
      )
      .option(
        `--wrapper-envs <${intlMsg.commands_common_options_wrapperEnvsPath()}>`,
        `${intlMsg.commands_common_options_wrapperEnvs()}`
      )
      .option(
        `-s, --strategy <${strategyStr}>`,
        `${intlMsg.commands_build_options_s({
          default: defaultStrategy,
        })}`
      )
      .option(`-w, --watch`, `${intlMsg.commands_build_options_w()}`)
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (options: Partial<BuildCommandOptions>) => {
        await run({
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultPolywrapManifest
          ),
          clientConfig: options.clientConfig || false,
          wrapperEnvs: options.wrapperEnvs || false,
          outputDir: parseDirOption(options.outputDir, defaultOutputDir),
          codegen: options.codegen || false,
          codegenDir: parseDirOption(options.codegenDir, defaultCodegenDir),
          strategy: options.strategy || defaultStrategy,
          watch: options.watch || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
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

async function run(options: Required<BuildCommandOptions>) {
  const {
    watch,
    manifestFile,
    clientConfig,
    wrapperEnvs,
    outputDir,
    strategy,
    codegen,
    codegenDir,
    verbose,
    quiet,
    logFile,
  } = options;
  const logger = createLogger({ verbose, quiet, logFile });

  const envs = await parseWrapperEnvsOption(wrapperEnvs);
  const configBuilder = await parseClientConfigOption(clientConfig);

  if (envs) {
    configBuilder.addEnvs(envs);
  }

  // Get Client
  const client = new PolywrapClient(configBuilder.build(), {
    noDefaults: true,
  });

  const project = await getProjectFromManifest(manifestFile, logger);

  if (!project) {
    return;
  }

  await project.validate();

  const manifest = await project.getManifest();
  const language = manifest.project.type;

  if (supportedProjectTypes.indexOf(language) === -1) {
    logger.error(
      intlMsg.commands_build_error_unsupportedProjectType({
        supportedTypes: supportedProjectTypes.join(", "),
      })
    );
    process.exit(1);
  }

  let buildStrategy: BuildStrategy<unknown>;

  if (isPolywrapManifestLanguage(language)) {
    await validateManifestModules(manifest as PolywrapManifest);

    buildStrategy = createBuildStrategy(
      strategy,
      outputDir,
      project as PolywrapProject
    );
  }

  const execute = async (): Promise<boolean> => {
    try {
      const schemaComposer = new SchemaComposer({
        project,
        client,
      });

      if (codegen) {
        const codeGenerator = new CodeGenerator({
          project,
          schemaComposer,
          codegenDirAbs: codegenDir,
        });
        const codegenSuccess = await codeGenerator.generate();

        if (!codegenSuccess) {
          logger.error(intlMsg.commands_build_error_codegen_failed());
          return false;
        }
      }

      const compiler = new Compiler({
        project: project as PolywrapProject,
        outputDir,
        schemaComposer,
        buildStrategy,
      });

      return await compiler.compile();
    } catch (err) {
      logger.error(err.message);
      return false;
    }
  };

  if (!watch) {
    const result = await execute();

    if (!result) {
      process.exit(1);
    }

    process.exit(0);
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
}
