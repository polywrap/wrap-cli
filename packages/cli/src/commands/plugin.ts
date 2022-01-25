/* eslint-disable prefer-const */
import { CodeGenerator, PluginProject, SchemaComposer } from "../lib";
import { fixParameters } from "../lib/helpers";
import { intlMsg } from "../lib/intl";

import { ComposerFilter } from "@web3api/schema-compose";
import { writeFileSync } from "@web3api/os-js";
import { GluegunToolbox, print } from "gluegun";
import axios from "axios";
import chalk from "chalk";
import path from "path";
import fs from "fs";

export const defaultManifest = ["web3api.plugin.yaml", "web3api.plugin.yml"];

const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_options_codegen();
const pathStr = intlMsg.commands_plugin_options_path();
const defaultManifestStr = defaultManifest.join(" | ");
const defaultOutputSchemaStr = "./build/schema.graphql";
const defaultOutputTypesStr = "./src/w3";
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
  -s, --output-schema-path <${pathStr}>  ${intlMsg.commands_plugins_options_schema(
  { default: defaultOutputSchemaStr }
)}
  -t, --output-types-dir <${pathStr}>    ${intlMsg.commands_plugins_options_types(
  { default: defaultOutputTypesStr }
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
      outputSchemaPath,
      outputTypesDir,
      ipfs,
      ens,
    } = parameters.options;
    const { h, m, s, t, i, e } = parameters.options;

    help = help || h;
    manifestPath = manifestPath || m;
    outputSchemaPath = outputSchemaPath || s;
    outputTypesDir = outputTypesDir || t;
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

    if (outputSchemaPath === true) {
      const outputSchemaMissingPathMessage = intlMsg.commands_plugin_error_outputDirMissingPath(
        {
          option: "--output-schema-path",
          argument: `<${pathStr}>`,
        }
      );
      print.error(outputSchemaMissingPathMessage);
      print.info(HELP);
      return;
    } else if (!outputSchemaPath) {
      outputSchemaPath = defaultOutputSchemaStr;
    }

    if (outputTypesDir === true) {
      const outputTypesMissingPathMessage = intlMsg.commands_plugin_error_outputDirMissingPath(
        {
          option: "--output-types-dir",
          argument: `<${pathStr}>`,
        }
      );
      print.error(outputTypesMissingPathMessage);
      print.info(HELP);
      return;
    } else if (!outputTypesDir) {
      outputTypesDir = defaultOutputTypesStr;
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
    outputSchemaPath = outputSchemaPath && filesystem.resolve(outputSchemaPath);
    outputTypesDir = outputTypesDir && filesystem.resolve(outputTypesDir);

    const project = new PluginProject({
      pluginManifestPath: manifestPath,
    });

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
      outputDir: outputTypesDir,
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
    const outputSchemaDir = path.dirname(outputSchemaPath);

    if (!fs.existsSync(outputSchemaDir)) {
      fs.mkdirSync(outputSchemaDir);
    }

    writeFileSync(outputSchemaPath, schemas.combined.schema);
  },
};
