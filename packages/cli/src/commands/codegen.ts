/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Command, Program } from "./types";
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
  isPluginManifestLanguage,
  generateWrapFile,
  defaultProjectManifestFiles,
  defaultPolywrapManifest,
  parseLogFileOption,
  parseWrapperEnvsOption,
} from "../lib";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";

import { PolywrapClient } from "@polywrap/client-js";
import path from "path";
import fs from "fs";
import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";

const defaultCodegenDir = "./src/wrap";
const defaultPublishDir = "./build";

const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");

type CodegenCommandOptions = {
  manifestFile: string;
  codegenDir: string;
  publishDir: string;
  script?: string;
  configBuilder: IClientConfigBuilder;
  wrapperEnvs: Record<string, Record<string, unknown>>;
  verbose?: boolean;
  quiet?: boolean;
  logFile?: string;
};

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
        ` ${intlMsg.commands_codegen_options_codegen({
          default: defaultCodegenDir,
        })}`
      )
      .option(
        `-p, --publish-dir <${pathStr}>`,
        `${intlMsg.commands_codegen_options_publish({
          default: defaultPublishDir,
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
      .action(async (options) => {
        await run({
          ...options,
          configBuilder: await parseClientConfigOption(options.clientConfig),
          wrapperEnvs: await parseWrapperEnvsOption(options.wrapperEnvs),
          codegenDir: parseDirOption(options.codegenDir, defaultCodegenDir),
          script: parseCodegenScriptOption(options.script),
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultProjectManifestFiles
          ),
          publishDir: parseDirOption(options.publishDir, defaultPublishDir),
          logFile: parseLogFileOption(options.logFile),
        });
      });
  },
};

async function run(options: CodegenCommandOptions) {
  const {
    manifestFile,
    codegenDir,
    script,
    configBuilder,
    wrapperEnvs,
    publishDir,
    verbose,
    quiet,
    logFile,
  } = options;
  const logger = createLogger({ verbose, quiet, logFile });

  if (wrapperEnvs) {
    configBuilder.addEnvs(wrapperEnvs);
  }

  // Get Client
  const client = new PolywrapClient(configBuilder.buildCoreConfig(), {
    noDefaults: true,
  });

  const project = await getProjectFromManifest(manifestFile, logger);

  if (!project) {
    return;
  }

  const projectType = await project.getManifestLanguage();

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

  // HACK: Codegen outputs wrap.info into a build directory for plugins, needs to be moved into a build command?
  if (isPluginManifestLanguage(projectType)) {
    // Output the built manifest
    const manifestPath = path.join(publishDir, "wrap.info");

    if (!fs.existsSync(publishDir)) {
      fs.mkdirSync(publishDir);
    }

    await generateWrapFile(
      await schemaComposer.getComposedAbis(),
      await project.getName(),
      "plugin",
      manifestPath,
      logger
    );
  }

  if (result) {
    logger.info(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exit(0);
  } else {
    process.exit(1);
  }
}
