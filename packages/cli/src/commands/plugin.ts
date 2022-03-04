/* eslint-disable prefer-const */
import { CodeGenerator, PluginProject, SchemaComposer } from "../lib";
import { fixParameters, outputManifest } from "../lib/helpers";
import { intlMsg } from "../lib/intl";

import { ComposerFilter } from "@web3api/schema-compose";
import { writeFileSync } from "@web3api/os-js";
import { GluegunToolbox, print } from "gluegun";
import axios from "axios";
import chalk from "chalk";
import path from "path";
import fs from "fs";

export const defaultManifest = ["web3api.plugin.yaml", "web3api.plugin.yml"];
const defaultPublishDir = "./build";
const defaultCodegenDir = "./src/w3";
const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_commands_codegen();
const pathStr = intlMsg.commands_plugin_options_path();
const defaultManifestStr = defaultManifest.join(" | ");
const nodeStr = intlMsg.commands_plugin_options_i_node();
const addrStr = intlMsg.commands_plugin_options_e_address();

const HELP = `
${chalk.bold("w3 plugin")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold("codegen")}   ${codegenStr}

Options:
  -h, --help                       ${intlMsg.commands_plugin_options_h()}
  -m, --manifest-path <${pathStr}>       ${intlMsg.commands_plugin_options_m({
  default: defaultManifestStr,
})}
  -p, --publish-dir <${pathStr}>  ${intlMsg.commands_plugin_options_publish(
  { default: defaultPublishDir }
)}
  -c, --codegen-dir <${pathStr}>    ${intlMsg.commands_plugin_options_codegen(
  { default: defaultCodegenDir }
)}
  -i, --ipfs [<${nodeStr}>]              ${intlMsg.commands_plugin_options_i()}
  -e, --ens [<${addrStr}>]            ${intlMsg.commands_plugin_options_e()}
`;

export default {
  alias: ["p"],
  description: intlMsg.commands_plugin_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters } = toolbox;

    // Options
    let {
      help,
      manifestPath,
      publishDir,
      codegenDir,
      ipfs,
      ens,
    } = parameters.options;
    const { h, m, p, c, i, e } = parameters.options;

    help = help || h;
    manifestPath = manifestPath || m;
    publishDir = publishDir || p;
    codegenDir = codegenDir || c;
    ipfs = ipfs || i;
    ens = ens || e;

    let command = "";
    try {
      const params = parameters;
      [command] = fixParameters(
        {
          options: params.options,
          array: params.array,
        },
        {
          h,
          help,
        }
      );
    } catch (e) {
      print.error(e.message);
      process.exitCode = 1;
      return;
    }

    if (help) {
      print.info(HELP);
      return;
    }

    if (!command) {
      print.error(intlMsg.commands_plugin_error_noCommand());
      print.info(HELP);
      return;
    }

    if (publishDir === true) {
      const publishDirMessage = intlMsg.commands_plugin_error_optionMissingArgument(
        {
          option: "--publish-dir",
          argument: `<${pathStr}>`,
        }
      );
      print.error(publishDirMessage);
      print.info(HELP);
      return;
    } else if (!publishDir) {
      publishDir = defaultPublishDir;
    }

    if (codegenDir === true) {
      const codegenDirMessage = intlMsg.commands_plugin_error_optionMissingArgument(
        {
          option: "--codegen-dir",
          argument: `<${pathStr}>`,
        }
      );
      print.error(codegenDirMessage);
      print.info(HELP);
      return;
    } else if (!codegenDir) {
      codegenDir = defaultCodegenDir;
    }

    if (ens === true) {
      const domStr = intlMsg.commands_plugin_error_domain();
      const ensAddressMissingMessage = intlMsg.commands_build_error_testEnsAddressMissing(
        {
          option: "--ens",
          argument: `<[${addrStr},]${domStr}>`,
        }
      );
      print.error(ensAddressMissingMessage);
      print.info(HELP);
      return;
    }

    let ipfsProvider: string | undefined;
    let ethProvider: string | undefined;
    let ensAddress: string | undefined = ens;

    if (typeof ipfs === "string") {
      // Custom IPFS provider
      ipfsProvider = ipfs;
    } else if (ipfs) {
      // Dev-server IPFS provider
      try {
        const {
          data: { ipfs, ethereum },
        } = await axios.get("http://localhost:4040/providers");
        ipfsProvider = ipfs;
        ethProvider = ethereum;
      } catch (e) {
        // Dev server not found
      }
    }

    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      ((await filesystem.existsAsync(defaultManifest[0]))
        ? filesystem.resolve(defaultManifest[0])
        : filesystem.resolve(defaultManifest[1]));
    publishDir = publishDir && filesystem.resolve(publishDir);
    codegenDir = codegenDir && filesystem.resolve(codegenDir);

    const project = new PluginProject({
      pluginManifestPath: manifestPath,
    });
    const manifest = await project.getPluginManifest();

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
      outputDir: codegenDir,
    });

    result = await codeGenerator.generate();

    if (result) {
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }

    // Output the built schema file
    const schemas = await schemaComposer.getComposedSchemas(
      ComposerFilter.Schema
    );
    const publishSchemaPath = path.join(publishDir, "schema.graphql");
    const publishManifestPath = path.join(publishDir, "web3api.plugin.json");

    if (!fs.existsSync(publishDir)) {
      fs.mkdirSync(publishDir);
    }

    writeFileSync(publishSchemaPath, schemas.combined.schema);
    outputManifest(manifest, publishManifestPath);
  },
};
