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
  isPluginManifestLanguage,
  generateWrapFile,
  defaultProjectManifestFiles,
  defaultPolywrapManifest,
} from "../lib";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";

import { PolywrapClient } from "@polywrap/client-js";
import path from "path";
import fs from "fs";

const defaultCodegenDir = "./src/wrap";
const defaultPublishDir = "./build";

const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");

export interface CodegenCommandOptions extends BaseCommandOptions {
  manifestFile: string;
  codegenDir: string;
  publishDir: string;
  script?: string;
  clientConfig: string;
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
        `${intlMsg.commands_codegen_options_codegen({
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
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .action(async (options) => {
        await run({
          ...options,
          codegenDir: parseDirOption(options.codegenDir, defaultCodegenDir),
          script: parseCodegenScriptOption(options.script),
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultProjectManifestFiles
          ),
          publishDir: parseDirOption(options.publishDir, defaultPublishDir),
        });
      });
  },
};

async function run(options: CodegenCommandOptions) {
  const {
    manifestFile,
    codegenDir,
    script,
    clientConfig,
    publishDir,
    verbose,
    quiet,
  } = options;
  const logger = createLogger({ verbose, quiet });

  // Get Client
  const config = await parseClientConfigOption(clientConfig);
  const client = new PolywrapClient(config);

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
