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
  Logger,
  parseWrapperEnvsOption,
  Project,
  AnyProjectManifest,
} from "../lib";

import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";

import { Env, PolywrapClient, Uri } from "@polywrap/client-js";
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
  wrapperEnvs: Env[];
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

  await generateProjectCache(project, client, logger);

  if (result) {
    logger.info(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exit(0);
  } else {
    process.exit(1);
  }
}

async function generateProjectCache(
  project: Project<AnyProjectManifest>,
  client: PolywrapClient,
  logger: Logger
) {
  const schemaComposer = new SchemaComposer({
    client: client,
    project: project,
  });

  const abi = await schemaComposer.getComposedAbis();

  if (abi.importedModuleTypes && abi.importedModuleTypes.length) {
    logger.info(intlMsg.commands_codegen_cache_init());
    const importsDir = path.join("./.polywrap", "imports");

    for (const module of abi.importedModuleTypes) {
      const uri = Uri.from(module.uri);
      const moduleSubDir = path.join(importsDir, module.namespace);

      logger.info(
        intlMsg.commands_codegen_cache_savingModule({
          dir: moduleSubDir,
          module: module.namespace,
        })
      );

      const wrapperManifestResult = await client.getManifest(uri);

      if (wrapperManifestResult.ok) {
        const manifest = wrapperManifestResult.value;

        if (!fs.existsSync(moduleSubDir)) {
          fs.mkdirSync(moduleSubDir, { recursive: true });
        }

        // Generate wrap.info
        const wrapInfoFilePath = path.join(moduleSubDir, "wrap.info");
        const abi = manifest.abi;

        await generateWrapFile(
          abi,
          manifest.name,
          manifest.type,
          wrapInfoFilePath,
          logger
        );

        // Extract wrap.wasm
        if (manifest.type === "wasm") {
          const wrapWasmFileResult = await client.getFile(uri, {
            path: "wrap.wasm",
          });

          if (wrapWasmFileResult.ok) {
            const wrapWasmFileContents = wrapWasmFileResult.value;
            const wrapWasmFilePath = path.join(moduleSubDir, "wrap.wasm");

            fs.writeFileSync(wrapWasmFilePath, wrapWasmFileContents);

            logger.info(
              intlMsg.commands_codegen_cache_moduleSaved({
                module: module.namespace,
                path: wrapWasmFilePath,
              })
            );
          } else {
            logger.error(
              intlMsg.commands_codegen_cache_moduleSaveError({
                module: module.namespace,
              })
            );
            logger.error(`${wrapWasmFileResult.error?.message}`);
          }
        }
      }
    }
  }
}
