/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Command, Program } from "./types";
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
  parseDirOptionIfExists,
  defaultCodegenDir,
  defaultPublishDir,
} from "../lib";

import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import path from "path";
import fs from "fs";

const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultProjectManifestFiles.join(" | ");

type CodegenCommandOptions = {
  manifestFile: string;
  codegenDir?: string;
  publishDir: string;
  script?: string;
  clientConfig: Partial<PolywrapClientConfig>;
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
      .action(async (options) => {
        await run({
          ...options,
          clientConfig: await parseClientConfigOption(options.clientConfig),
          codegenDir: parseDirOptionIfExists(options.codegenDir),
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
  } = options;

  // Get Client
  const client = new PolywrapClient(clientConfig);

  const project = await getProjectFromManifest(manifestFile);

  if (!project) {
    return;
  }

  const projectType = await project.getManifestLanguage();

  let result = false;

  const schemaComposer = new SchemaComposer({
    project,
    client,
  });
  const codeGenerator = new CodeGenerator({
    project,
    schemaComposer,
    codegenDirAbs: codegenDir,
    customScript: script,
  });

  result = await codeGenerator.generate();

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
      manifestPath
    );
  }

  if (result) {
    console.log(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
