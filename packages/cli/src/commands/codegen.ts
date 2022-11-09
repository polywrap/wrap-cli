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
} from "../lib";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";

import { PolywrapClient, Uri } from "@polywrap/client-js";
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
    publishDir,
    verbose,
    quiet,
    logFile,
  } = options;
  const logger = createLogger({ verbose, quiet, logFile });

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

  //
  const abi = await schemaComposer.getComposedAbis();

  if (abi.importedModuleTypes && abi.importedModuleTypes.length) {
    logger.info("Caching imported modules...");
    const importsDir = path.join("./.polywrap", "imports");

    for (const module of abi.importedModuleTypes) {
      const uri = Uri.from(module.uri);
      const moduleSubDir = path.join(importsDir, uri.path);

      const wrapperResult = await client.loadWrapper(uri);
      if (wrapperResult.ok) {
        const wrapper = wrapperResult.value;
        const manifest = wrapper.getManifest();

        // We can only generate wrap.info for plugins - maybe do this?
        if (manifest.type === "plugin") {
          logger.info(`Skipping caching of Plugin wrapper ${uri.uri}.`);
          continue;
        }

        // Create dir if not exist
        if (!fs.existsSync(moduleSubDir)) {
          fs.mkdirSync(moduleSubDir, { recursive: true });
        }

        //wrap.info
        const wrapInfoFileResult = await wrapper.getFile({ path: "wrap.info" });

        if (wrapInfoFileResult.ok) {
          const wrapInfoFileContents = wrapInfoFileResult.value;
          const wrapInfoFilePath = path.join(moduleSubDir, "wrap.info");
          fs.writeFileSync(wrapInfoFilePath, wrapInfoFileContents);
        } else {
          logger.error(wrapInfoFileResult.error?.message ?? "");
        }

        if (manifest.type === "wasm") {
          //wrap.wasm
          const wrapWasmFileResult = await wrapper.getFile({
            path: "wrap.wasm",
          });

          if (wrapWasmFileResult.ok) {
            const wrapWasmFileContents = wrapWasmFileResult.value;
            const wrapWasmFilePath = path.join(moduleSubDir, "wrap.wasm");

            fs.writeFileSync(wrapWasmFilePath, wrapWasmFileContents);
          } else {
            logger.error(wrapWasmFileResult.error?.message ?? "");
          }
        }

        // //schema.graphql
        // const abi = manifest.abi;
        // const schema = renderSchema(abi, false);
        // const schemaFile = path.join(moduleImportsDir, "schema.graphql");

        // const dir = path.dirname(schemaFile);
        // if (!fs.existsSync(dir)) {
        //   fs.mkdirSync(dir, { recursive: true });
        // }
        // fs.writeFileSync(schemaFile, schema, { encoding: "utf-8" });
      }
    }
  }

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
