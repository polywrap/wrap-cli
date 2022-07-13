import { Command, Program } from "./types";
import {
  CodeGenerator,
  PluginProject,
  SchemaComposer,
  defaultPluginManifest,
  outputManifest,
  intlMsg,
  parsePluginCodegenDirOption,
  parsePluginManifestFileOption,
  parsePluginPublishDirOption,
  parseClientConfigOption,
} from "../lib";

import { ComposerFilter } from "@polywrap/schema-compose";
import { writeFileSync } from "@polywrap/os-js";
import path from "path";
import fs from "fs";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";

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

  let result = false;

  const codeGenerator = new CodeGenerator({
    project,
    schemaComposer,
    codegenDirAbs: codegenDir,
  });

  result = await codeGenerator.generate();

  if (result) {
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }

  // Output the built manifest
  const publishManifestPath = path.join(publishDir, "polywrap.plugin.json");

  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }

  await outputManifest(manifest, publishManifestPath);
}
