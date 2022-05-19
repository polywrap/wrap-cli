/* eslint-disable prefer-const */
import {
  Compiler,
  Web3ApiProject,
  SchemaComposer,
  Watcher,
  WatchEvent,
  watchEventName,
  intlMsg,
  defaultWeb3ApiManifest,
  resolvePathIfExists,
  isDockerInstalled,
  FileLock,
} from "../lib";

import chalk from "chalk";
import path from "path";
import readline from "readline";
import { GluegunToolbox, GluegunPrint } from "gluegun";

const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");
const defaultOutputDirectory = "./build";
const optionsStr = intlMsg.commands_build_options_options();
const pathStr = intlMsg.commands_build_options_o_path();

const HELP = `
${chalk.bold("w3 build")} [${optionsStr}]

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                         ${intlMsg.commands_build_options_h()}
  -m, --manifest-file <${pathStr}>         ${intlMsg.commands_build_options_m({
  default: defaultManifestStr,
})}
  -o, --output-dir <${pathStr}>            ${intlMsg.commands_build_options_o()}
  -w, --watch                        ${intlMsg.commands_build_options_w()}
  -v, --verbose                      ${intlMsg.commands_build_options_v()}
`;

export default {
  alias: ["b"],
  description: intlMsg.commands_build_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    const { h, m, o, w, v } = parameters.options;
    let { help, manifestFile, outputDir, watch, verbose } = parameters.options;

    help = help || h;
    manifestFile = manifestFile || m;
    outputDir = outputDir || o;
    watch = watch || w;
    verbose = verbose || v;

    // Validate Params
    const paramsValid = validateBuildParams(print, manifestFile, outputDir);

    if (help || !paramsValid) {
      print.info(HELP);
      if (!paramsValid) {
        process.exitCode = 1;
      }
      return;
    }

    // Ensure docker is installed
    if (!isDockerInstalled()) {
      print.error(intlMsg.lib_docker_noInstall());
      return;
    }

    // Resolve manifest & output directory
    const manifestPaths = manifestFile
      ? [manifestFile as string]
      : defaultWeb3ApiManifest;
    manifestFile = resolvePathIfExists(filesystem, manifestPaths);

    if (!manifestFile) {
      print.error(
        intlMsg.commands_build_error_manifestNotFound({
          paths: manifestPaths.join(", "),
        })
      );
      return;
    }

    outputDir =
      (outputDir && filesystem.resolve(outputDir)) ||
      filesystem.path(defaultOutputDirectory);

    const project = new Web3ApiProject({
      rootCacheDir: path.dirname(manifestFile),
      web3apiManifestPath: manifestFile,
      quiet: verbose ? false : true,
    });
    await project.validate();

    // Aquire a project specific lock file for the docker service
    const dockerLock = new FileLock(
      project.getCachePath("build/DOCKER_LOCK"),
      print.error
    );

    const schemaComposer = new SchemaComposer({
      project,
    });

    const compiler = new Compiler({
      project,
      outputDir,
      schemaComposer,
    });

    const execute = async (): Promise<boolean> => {
      compiler.reset();
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
        print.info(
          `${intlMsg.commands_build_keypressListener_watching()}: ${project.getManifestDir()}`
        );
        print.info(intlMsg.commands_build_keypressListener_exit());
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
        ignored: [outputDir + "/**", project.getManifestDir() + "/**/w3/**"],
        ignoreInitial: true,
        execute: async (events: WatchEvent[]) => {
          // Log all of the events encountered
          for (const event of events) {
            print.info(`${watchEventName(event.type)}: ${event.path}`);
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
  },
};

function validateBuildParams(
  print: GluegunPrint,
  manifestFile: unknown,
  outputDir: unknown
): boolean {
  if (manifestFile === true) {
    const manifestPathMissingMessage = intlMsg.commands_build_error_manifestPathMissing(
      {
        option: "--manifest-file",
        argument: `<${pathStr}>`,
      }
    );
    print.error(manifestPathMissingMessage);
    return false;
  }

  if (outputDir === true) {
    const outputDirMissingPathMessage = intlMsg.commands_build_error_outputDirMissingPath(
      {
        option: "--output-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(outputDirMissingPathMessage);
    return false;
  }

  return true;
}
