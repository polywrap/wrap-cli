import { Command, Program } from "./types";
import {
  Compiler,
  PolywrapProject,
  SchemaComposer,
  Watcher,
  WatchEvent,
  watchEventName,
  intlMsg,
  defaultPolywrapManifest,
  isDockerInstalled,
  FileLock,
  parseWasmManifestFileOption,
  parseDirOption,
  parseClientConfigOption,
  CompilerOverrides,
} from "../lib";
import { DockerBuildStrategy } from "../lib/source-builders/SourceBuilder";

import fs from "fs";
import { print } from "gluegun";
import path from "path";
import readline from "readline";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";

const defaultOutputDir = "./build";
const defaultManifestStr = defaultPolywrapManifest.join(" | ");
const pathStr = intlMsg.commands_build_options_o_path();

type BuildCommandOptions = {
  manifestFile: string;
  outputDir: string;
  clientConfig: Partial<PolywrapClientConfig>;
  watch?: boolean;
  verbose?: boolean;
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
      .option(`-w, --watch`, `${intlMsg.commands_build_options_w()}`)
      .option(`-v, --verbose`, `${intlMsg.commands_build_options_v()}`)
      .action(async (options) => {
        await run({
          ...options,
          manifestFile: parseWasmManifestFileOption(options.manifestFile),
          clientConfig: await parseClientConfigOption(options.clientConfig),
          outputDir: parseDirOption(options.outputDir, defaultOutputDir),
        });
      });
  },
};

async function composeAbi(schemaComposer: SchemaComposer) {
  const abi = await schemaComposer.getComposedAbis();

  if (!abi) {
    throw Error(intlMsg.lib_compiler_failedAbiReturn());
  }

  return abi;
}

async function getCompilerOverrides(project: PolywrapProject) {
  // Get the PolywrapManifest
  const polywrapManifest = await project.getManifest();

  let compilerOverrides: CompilerOverrides | undefined;

  // Allow the build-image to validate the manifest & override functionality
  if (this._config.sourceBuildStrategy instanceof DockerBuildStrategy) {
    const buildImageDir = `${__dirname}/defaults/build-images/${polywrapManifest.project.type}`;
    const buildImageEntryFile = path.join(buildImageDir, "index.ts");

    if (fs.existsSync(buildImageEntryFile)) {
      const module = await import(buildImageDir);

      // Get any compiler overrides for the given build-image
      if (module.getCompilerOverrides) {
        compilerOverrides = module.getCompilerOverrides() as CompilerOverrides;
      }

      if (compilerOverrides) {
        // Validate the manifest for the given build-image
        if (compilerOverrides.validateManifest) {
          compilerOverrides.validateManifest(polywrapManifest);
        }
      }
    }
  }

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

  return compilerOverrides;
}

async function run(options: BuildCommandOptions) {
  const { watch, verbose, manifestFile, outputDir, clientConfig } = options;

  // Get Client
  const client = new PolywrapClient(clientConfig);

  // Ensure docker is installed
  if (!isDockerInstalled()) {
    console.log(intlMsg.lib_docker_noInstall());
    return;
  }

  const project = new PolywrapProject({
    rootDir: path.dirname(manifestFile),
    polywrapManifestPath: manifestFile,
    quiet: !verbose,
  });
  await project.validate();

  const dockerLock = new FileLock(
    project.getCachePath("build/DOCKER_LOCK"),
    print.error
  );

  const dockerBuildStrategy = new DockerBuildStrategy();

  const schemaComposer = new SchemaComposer({
    project,
    client,
  });

  const execute = async (): Promise<boolean> => {
    project.reset();
    schemaComposer.reset();

    // Compose the ABI
    const abi = await composeAbi(schemaComposer);
    const compilerOverrides = await getCompilerOverrides(project);

    const compiler = new Compiler({
      project,
      outputDir,
      compilerOverrides,
      abi,
      sourceBuildStrategy: dockerBuildStrategy,
    });

    const result = await compiler.compile();

    if (!result) {
      return result;
    }

    return true;
  };

  if (!watch) {
    await dockerLock.request();
    const result = await execute();
    await dockerLock.release();

    if (!result) {
      process.exitCode = 1;
      return;
    }
  } else {
    // Execute
    await dockerLock.request();
    await execute();
    await dockerLock.release();

    const keyPressListener = () => {
      // Watch for escape key presses
      console.log(
        `${intlMsg.commands_build_keypressListener_watching()}: ${project.getManifestDir()}`
      );
      console.log(intlMsg.commands_build_keypressListener_exit());
      readline.emitKeypressEvents(process.stdin);
      process.stdin.on("keypress", async (str, key) => {
        if (
          key.name == "escape" ||
          key.name == "q" ||
          (key.name == "c" && key.ctrl)
        ) {
          await watcher.stop();
          await dockerLock.release();
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
          console.log(`${watchEventName(event.type)}: ${event.path}`);
        }

        // Execute the build
        await dockerLock.request();
        await execute();
        await dockerLock.release();

        // Process key presses
        keyPressListener();
      },
    });
  }

  process.exitCode = 0;
}
