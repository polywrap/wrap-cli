import { Command, Program } from "./types";
import {
  CodeGenerator,
  PluginProject,
  SchemaComposer,
  defaultPluginManifest,
  intlMsg,
  parsePluginCodegenDirOption,
  parsePluginManifestFileOption,
  parsePluginPublishDirOption,
  parseClientConfigOption,
  generateWrapFile,
} from "../lib";

import path from "path";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import fs from "fs";

const defaultPublishDir = "./build";
const defaultCodegenDir = "./wrap";
const pathStr = intlMsg.commands_plugin_options_path();
const defaultManifestStr = defaultPluginManifest.join(" | ");

type PluginCommandOptions = {
  manifestFile: string;
  publishDir: string;
  codegenDir: string;
  clientConfig: Partial<PolywrapClientConfig>;
};

export const plugin: Command = {
  setup: (program: Program) => {
    const pluginCommand = program
      .command("plugin")
      .alias("p")
      .description(intlMsg.commands_plugin_description());

    pluginCommand
      .command("codegen")
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_plugin_options_m({
          default: defaultManifestStr,
        })}`
      )
      .option(
        `-p, --publish-dir <${pathStr}>`,
        `${intlMsg.commands_plugin_options_publish({
          default: defaultPublishDir,
        })}`
      )
      .option(
        `-g, --codegen-dir <${pathStr}>`,
        `${intlMsg.commands_plugin_options_codegen({
          default: defaultCodegenDir,
        })}`
      )
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .action(async (options) => {
        await run({
          ...options,
          clientConfig: await parseClientConfigOption(
            options.clientConfig,
            undefined
          ),
          manifestFile: parsePluginManifestFileOption(
            options.manifestFile,
            undefined
          ),
          publishDir: parsePluginPublishDirOption(
            options.publishDir,
            undefined
          ),
          codegenDir: parsePluginCodegenDirOption(
            options.codegenDir,
            undefined
          ),
        });
      });
  },
};
async function run(options: PluginCommandOptions) {
  const { manifestFile, codegenDir, publishDir, clientConfig } = options;

  // Get Client
  const client = new PolywrapClient(clientConfig);

  // Plugin project
  const project = new PluginProject({
    rootDir: path.dirname(manifestFile),
    pluginManifestPath: manifestFile,
  });
  await project.validate();
  const manifest = await project.getManifest();
  const schemaComposer = new SchemaComposer({
    project,
    client,
  });

  const codeGenerator = new CodeGenerator({
    project,
    schemaComposer,
    codegenDirAbs: codegenDir,
  });

  const result = await codeGenerator.generate();
  process.exitCode = result ? 0 : 1;

  // Output the built manifest
  const manifestPath = path.join(publishDir, "wrap.info");

  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }

  await generateWrapFile(
    await schemaComposer.getComposedAbis(),
    manifest.name,
    "plugin",
    manifestPath
  );
}
