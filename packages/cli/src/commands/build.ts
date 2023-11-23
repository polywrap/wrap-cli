import { Command, Program, BaseCommandOptions } from "./types";
import { createLogger } from "./utils/createLogger";
import {
  Compiler,
  PolywrapProject,
  SchemaComposer,
  intlMsg,
  defaultPolywrapManifestFiles,
  parseDirOption,
  parseClientConfigOption,
  parseManifestFileOption,
  parseLogFileOption,
  getProjectFromManifest,
  isPolywrapManifestLanguage,
  polywrapManifestLanguages,
  pluginManifestLanguages,
  parseWrapperEnvsOption,
  parseDirOptionNoDefault,
} from "../lib";
import { CodeGenerator } from "../lib/codegen";
import {
  DockerVMBuildStrategy,
  BuildStrategy,
  SupportedStrategies,
  DockerImageBuildStrategy,
  LocalBuildStrategy,
  NoopBuildStrategy,
} from "../lib/build-strategies";
import { DEFAULT_CODEGEN_DIR } from "../lib/defaults";
import { watchProject } from "../lib/watchProject";
import { parseUriOption } from "../lib/option-parsers/uri";

import { PolywrapClient } from "@polywrap/client-js";
import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";

const defaultOutputDir = "./build";
const defaultStrategy = SupportedStrategies.VM;
const strategyStr = Object.values(SupportedStrategies).join(" | ");
const defaultManifestStr = defaultPolywrapManifestFiles.join(" | ");
const pathStr = intlMsg.commands_build_options_o_path();

const supportedProjectTypes = [
  ...Object.values(polywrapManifestLanguages),
  ...Object.values(pluginManifestLanguages),
];

export interface BuildCommandOptions extends BaseCommandOptions {
  manifestFile: string;
  outputDir: string;
  bindgen: string | false;
  clientConfig: string | false;
  wrapperEnvs: string | false;
  noCodegen: boolean;
  noWasm: boolean;
  codegenDir: string | false;
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
      .option(`-b, --bindgen <URI>`, `${intlMsg.commands_codegen_options_b()}`)
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .option(`-n, --no-codegen`, `${intlMsg.commands_build_options_codegen()}`)
      .option(`--no-wasm`, `${intlMsg.commands_build_options_no_wasm()}`)
      .option(
        `--codegen-dir`,
        `${intlMsg.commands_build_options_codegen_dir({
          default: DEFAULT_CODEGEN_DIR,
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
      .option(`-w, --watch`, `${intlMsg.commands_common_options_w()}`)
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(
        async (
          options: Partial<BuildCommandOptions> & { codegen: boolean }
        ) => {
          await run({
            manifestFile: parseManifestFileOption(
              options.manifestFile,
              defaultPolywrapManifestFiles
            ),
            clientConfig: options.clientConfig || false,
            wrapperEnvs: options.wrapperEnvs || false,
            outputDir: parseDirOption(options.outputDir, defaultOutputDir),
            bindgen: options.bindgen || false,
            noCodegen: !options.codegen || false,
            noWasm: !options.wasm || false,
            codegenDir: parseDirOptionNoDefault(options.codegenDir),
            strategy: options.strategy || defaultStrategy,
            watch: options.watch || false,
            verbose: options.verbose || false,
            quiet: options.quiet || false,
            logFile: parseLogFileOption(options.logFile),
          });
        }
      );
  },
};

async function validateManifestModules(polywrapManifest: PolywrapManifest) {
  if (
    polywrapManifest.project.type !== "interface" &&
    !polywrapManifest.source?.module
  ) {
    const missingModuleMessage = intlMsg.lib_compiler_missingModule();
    throw Error(missingModuleMessage);
  }

  if (
    polywrapManifest.project.type === "interface" &&
    polywrapManifest.source?.module
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
    bindgen,
    strategy,
    noCodegen,
    noWasm,
    codegenDir,
    verbose,
    quiet,
    logFile,
  } = options;

  const logger = createLogger({ verbose, quiet, logFile });
  const bindgenUri = parseUriOption(bindgen);
  const envs = await parseWrapperEnvsOption(wrapperEnvs);
  const configBuilder = await parseClientConfigOption(clientConfig);

  if (envs) {
    configBuilder.addEnvs(envs);
  }

  // Get Client
  const client = new PolywrapClient(configBuilder.build());

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
  let canRunCodegen = true;

  if (isPolywrapManifestLanguage(language)) {
    await validateManifestModules(manifest as PolywrapManifest);

    const isInterface = language === "interface";

    if (isInterface || noWasm) {
      buildStrategy = new NoopBuildStrategy({
        project: project as PolywrapProject,
        outputDir,
      });
    } else {
      buildStrategy = createBuildStrategy(
        strategy,
        outputDir,
        project as PolywrapProject
      );
    }

    canRunCodegen = !isInterface;
  }

  const execute = async (): Promise<boolean> => {
    try {
      const schemaComposer = new SchemaComposer({
        project,
        client,
      });
      const abi = await schemaComposer.getComposedAbis();

      if (canRunCodegen && !noCodegen) {
        const codeGenerator = new CodeGenerator({
          project,
          abi,
          codegenDirAbs: codegenDir || undefined,
          bindgenUri,
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
        abi,
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
    await watchProject({
      execute,
      logger,
      project,
      ignored: [outputDir + "/**", project.getManifestDir() + "/**/wrap/**"],
    });
  }
}
