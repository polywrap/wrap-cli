/* eslint-disable prefer-const */
import { CodeGenerator, PluginProject, SchemaComposer } from "../lib";
import { fixParameters, resolvePathIfExists, defaultPluginManifest } from "../lib/helpers";
import { intlMsg } from "../lib/intl";
import { getDefaultProviders } from "../lib/helpers/client";

import { ComposerFilter } from "@web3api/schema-compose";
import { writeFileSync } from "@web3api/os-js";
import { GluegunPrint, GluegunToolbox, print } from "gluegun";
import chalk from "chalk";
import path from "path";
import fs from "fs";

const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_options_codegen();
const pathStr = intlMsg.commands_plugin_options_path();
const defaultManifestStr = defaultPluginManifest.join(" | ");
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
  -s, --output-schema-path <${pathStr}>  ${intlMsg.commands_plugin_options_s({
  default: defaultOutputSchemaStr,
})}
  -t, --output-types-dir <${pathStr}>    ${intlMsg.commands_plugin_options_t({
  default: defaultOutputTypesStr,
})}
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

    if (help || !validatePluginParams(
      print, command, outputSchemaPath, (path) => outputSchemaPath = path,
      outputTypesDir, (dir) => outputTypesDir = dir, ens
    )) {
      print.info(HELP);
      return;
    }

    const { ipfsProvider, ethProvider } = await getDefaultProviders(ipfs);
    const ensAddress: string | undefined = ens;

    manifestPath = resolvePathIfExists(
      filesystem,
      manifestPath ? [manifestPath] : defaultPluginManifest
    );
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

function validatePluginParams(
  print: GluegunPrint,
  command: unknown,
  outputSchemaPath: unknown,
  setOutputSchemaPath: (path: string) => void,
  outputTypesDir: unknown,
  setOutputTypesDir: (dir: string) => void,
  ens: unknown
): boolean {
  if (!command) {
    print.error(intlMsg.commands_plugin_error_noCommand());
    return false;
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
    return false;
  } else if (!outputSchemaPath) {
    setOutputSchemaPath(defaultOutputSchemaStr);
  }

  if (outputTypesDir === true) {
    const outputTypesMissingPathMessage = intlMsg.commands_plugin_error_outputDirMissingPath(
      {
        option: "--output-types-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(outputTypesMissingPathMessage);
    return false;
  } else if (!outputTypesDir) {
    setOutputTypesDir(defaultOutputTypesStr);
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
    return false;
  }

  return true;
}
