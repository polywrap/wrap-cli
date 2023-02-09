/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Command, Program, BaseCommandOptions } from "./types";
import { createLogger } from "./utils/createLogger";
import {
  CodeGenerator,
  SchemaComposer,
  intlMsg,
  parseDirOption,
  parseCodegenScriptOption,
  parseManifestFileOption,
  parseClientConfigOption,
  getProjectFromManifest,
  defaultProjectManifestFiles,
  defaultPolywrapManifest,
  parseLogFileOption,
  parseWrapperEnvsOption,
} from "../lib";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";
import { defaultCodegenDir } from "../lib/defaults/defaultCodegenDir";

import { PolywrapClient } from "@polywrap/client-js";

const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");

export interface CodegenCommandOptions extends BaseCommandOptions {
  manifestFile: string;
  codegenDir: string;
  script: string | false;
  clientConfig: string | false;
  wrapperEnvs: string | false;
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
          default: defaultCodegenDir,
        })}`
      )
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
          codegenDir: parseDirOption(options.codegenDir, defaultCodegenDir),
          script: parseCodegenScriptOption(options.script),
          clientConfig: options.clientConfig || false,
          wrapperEnvs: options.wrapperEnvs || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
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
    script,
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

  const codeGenerator = script
    ? new ScriptCodegenerator({
        codegenDirAbs: codegenDir,
        script,
        schemaComposer,
        project,
        omitHeader: false,
        mustacheView: undefined,
      })
    : new CodeGenerator({
        codegenDirAbs: codegenDir,
        schemaComposer,
        project,
      });

  const result = await codeGenerator.generate();

  if (result) {
    logger.info(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exit(0);
  } else {
    process.exit(1);
  }
}
