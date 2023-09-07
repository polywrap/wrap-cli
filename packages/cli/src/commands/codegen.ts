/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Command, Program, BaseCommandOptions } from "./types";
import { createLogger } from "./utils/createLogger";
import {
  CodeGenerator,
  SchemaComposer,
  intlMsg,
  parseDirOptionNoDefault,
  parseCodegenScriptOption,
  parseManifestFileOption,
  parseClientConfigOption,
  getProjectFromManifest,
  defaultProjectManifestFiles,
  defaultPolywrapManifestFiles,
  parseLogFileOption,
  parseWrapperEnvsOption,
  WasmEmbed,
  getWasmEmbeds,
} from "../lib";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";
import { DEFAULT_CODEGEN_DIR } from "../lib/defaults";
import { watchProject } from "../lib/watchProject";
import { parseUriOption } from "../lib/option-parsers/uri";

import { PolywrapClient } from "@polywrap/client-js";

const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultPolywrapManifestFiles.join(" | ");

export interface CodegenCommandOptions extends BaseCommandOptions {
  manifestFile: string;
  codegenDir: string | false;
  bindgen: string | false;
  embed: boolean | false;
  script: string | false;
  clientConfig: string | false;
  wrapperEnvs: string | false;
  watch: boolean;
}

export const codegen: Command = {
  setup: (program: Program) => {
    program
      .command("codegen")
      .alias("g")
      .description(intlMsg.commands_codegen_description())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_codegen_options_m({
          default: defaultManifestStr,
        })}`
      )
      .option(
        `-g, --codegen-dir <${pathStr}>`,
        `${intlMsg.commands_codegen_options_codegen({
          default: DEFAULT_CODEGEN_DIR,
        })}`
      )
      .option(`-b, --bindgen <URI>`, `${intlMsg.commands_codegen_options_b()}`)
      .option(`-e, --embed`, `${intlMsg.commands_codegen_options_e()}`)
      .option(
        `-s, --script <${pathStr}>`,
        `${intlMsg.commands_codegen_options_s()}`
      )
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .option(
        `--wrapper-envs <${intlMsg.commands_common_options_wrapperEnvsPath()}>`,
        `${intlMsg.commands_common_options_wrapperEnvs()}`
      )
      .option(`-w, --watch`, `${intlMsg.commands_common_options_w()}`)
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (options: Partial<CodegenCommandOptions>) => {
        await run({
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultProjectManifestFiles
          ),
          codegenDir: parseDirOptionNoDefault(options.codegenDir),
          bindgen: options.bindgen || false,
          embed: options.embed || false,
          script: parseCodegenScriptOption(options.script),
          clientConfig: options.clientConfig || false,
          wrapperEnvs: options.wrapperEnvs || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
          watch: options.watch || false,
        });
      });
  },
};

async function run(options: Required<CodegenCommandOptions>) {
  const {
    manifestFile,
    clientConfig,
    wrapperEnvs,
    codegenDir,
    bindgen,
    embed,
    script,
    verbose,
    quiet,
    logFile,
    watch,
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
    logger.error(
      `${intlMsg.commands_codegen_project_load_error({
        manifestPath: manifestFile,
      })}`
    );
    process.exit(1);
  }

  const schemaComposer = new SchemaComposer({
    project,
    client,
  });
  const abi = await schemaComposer.getComposedAbis();

  const projectLang = await project.getManifestLanguage();
  if (embed && !projectLang.startsWith("app")) {
    logger.error(intlMsg.commands_codegen_error_embedAppOnly());
    process.exit(1);
  }

  const embeds: WasmEmbed[] | undefined =
    embed && abi.importedModuleTypes
      ? await getWasmEmbeds(abi.importedModuleTypes, client, logger)
      : undefined;

  const codeGenerator = script
    ? new ScriptCodegenerator({
        codegenDirAbs: codegenDir || undefined,
        script,
        abi,
        project,
        omitHeader: false,
        mustacheView: undefined,
      })
    : new CodeGenerator({
        codegenDirAbs: codegenDir || undefined,
        abi,
        project,
        bindgenUri,
        embeds,
      });

  const execute = async (): Promise<boolean> => {
    let result = false;

    try {
      result = await codeGenerator.generate();

      if (result) {
        logger.info(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
      }
    } catch (err) {
      logger.error(err.message);
      return false;
    }

    return result;
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
      ignored: [codegenDir + "/**", project.getManifestDir() + "/**/wrap/**"],
    });
  }
}
