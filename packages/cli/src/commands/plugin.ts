import { Command, Program } from "./types";
import {
  CodeGenerator,
  PluginProject,
  SchemaComposer,
  defaultPluginManifest,
  outputManifest,
  intlMsg,
  getTestEnvProviders,
  parsePluginCodegenDirOption,
  parsePluginManifestFileOption,
  parsePluginPublishDirOption,
} from "../lib";

import { ComposerFilter } from "@polywrap/schema-compose";
import { writeFileSync } from "@polywrap/os-js";
import path from "path";
import fs from "fs";

const defaultPublishDir = "./build";
const defaultCodegenDir = "./wrap";
const pathStr = intlMsg.commands_plugin_options_path();
const defaultManifestStr = defaultPluginManifest.join(" | ");
const nodeStr = intlMsg.commands_plugin_options_i_node();
const addrStr = intlMsg.commands_plugin_options_e_address();

type PluginCommandOptions = {
  manifestFile: string;
  publishDir: string;
  codegenDir: string;
  ipfs?: string;
  ens?: string;
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
        `-c, --codegen-dir <${pathStr}>`,
        `${intlMsg.commands_plugin_options_codegen({
          default: defaultCodegenDir,
        })}`
      )
      .option(
        `-i, --ipfs [<${nodeStr}>]`,
        `${intlMsg.commands_plugin_options_i()}`
      )
      .option(
        `-e, --ens [<${addrStr}>]`,
        `${intlMsg.commands_plugin_options_e()}`
      )
      .action(async (options) => {
        await run({
          ...options,
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
  const { ipfs, ens, manifestFile, codegenDir, publishDir } = options;

  const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
  const ensAddress: string | undefined = ens;

  // Plugin project
  const project = new PluginProject({
    rootDir: path.dirname(manifestFile),
    pluginManifestPath: manifestFile,
  });
  await project.validate();
  const manifest = await project.getManifest();

  const schemaComposer = new SchemaComposer({
    project,
    ipfsProvider,
    ethProvider,
    ensAddress,
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

  // Output the built schema & manifest
  const schemas = await schemaComposer.getComposedSchemas(
    ComposerFilter.Schema
  );
  const publishSchemaPath = path.join(publishDir, "schema.graphql");
  const publishManifestPath = path.join(publishDir, "polywrap.plugin.json");

  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }

  writeFileSync(publishSchemaPath, schemas.schema);
  await outputManifest(manifest, publishManifestPath);
}
