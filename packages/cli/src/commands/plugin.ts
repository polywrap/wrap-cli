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

const commands = ["codegen"];
const defaultOutputSchemaFile = "./build/schema.graphql";
const defaultOutputTypesDir = "./polywrap";
const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_options_codegen();
const pathStr = intlMsg.commands_plugin_options_path();
const defaultManifestStr = defaultPluginManifest.join(" | ");
const nodeStr = intlMsg.commands_plugin_options_i_node();
const addrStr = intlMsg.commands_plugin_options_e_address();

const HELP = `
${chalk.bold("w3 plugin")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold("codegen")}   ${codegenStr}

Options:
  -h, --help                       ${intlMsg.commands_plugin_options_h()}
  -m, --manifest-file <${pathStr}>       ${intlMsg.commands_plugin_options_m({
  default: defaultManifestStr,
})}
  -s, --output-schema-file <${pathStr}>  ${intlMsg.commands_plugin_options_s({
  default: defaultOutputSchemaFile,
})}
  -t, --output-types-dir <${pathStr}>    ${intlMsg.commands_plugin_options_t({
  default: defaultOutputTypesDir,
})}
  -i, --ipfs [<${nodeStr}>]              ${intlMsg.commands_plugin_options_i()}
  -e, --ens [<${addrStr}>]            ${intlMsg.commands_plugin_options_e()}
`;

export default {
  alias: ["p"],
  description: intlMsg.commands_plugin_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, middleware } = toolbox;

    // Options
    let {
      help,
      manifestFile,
      outputSchemaFile,
      outputTypesDir,
      ipfs,
      ens,
    } = parameters.options;
    const { h, m, s, t, i, e } = parameters.options;

    help = help || h;
    manifestFile = manifestFile || m;
    outputSchemaFile = outputSchemaFile || s;
    outputTypesDir = outputTypesDir || t;
    ipfs = ipfs || i;
    ens = ens || e;

    // Command
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

    // Validate Params
    const paramsValid = validatePluginParams(
      print,
      command,
      outputSchemaFile,
      (path) => outputSchemaFile = path,
      outputTypesDir,
      (dir) => outputTypesDir = dir,
      ens,
    );

    if (help || !paramsValid) {
      print.info(HELP);
      if (!paramsValid) {
        process.exitCode = 1;
      }
      return;
    }

    // Run Middleware
    await middleware.run({
      name: toolbox.command?.name,
      options: { help, manifestFile, outputSchemaFile, outputTypesDir, ipfs, ens, command },
    });

    const { ipfsProvider, ethProvider } = await getDefaultProviders(ipfs);
    const ensAddress: string | undefined = ens;

    manifestFile = resolvePathIfExists(
      filesystem,
      manifestFile ? [manifestFile] : defaultPluginManifest
    );
    outputSchemaFile = outputSchemaFile && filesystem.resolve(outputSchemaFile);
    outputTypesDir = outputTypesDir && filesystem.resolve(outputTypesDir);

    // Plugin project
    const project = new PluginProject({
      rootCacheDir: path.dirname(manifestFile),
      pluginManifestPath: manifestFile,
    });
    await project.validate();

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
    const outputSchemaDir = path.dirname(outputSchemaFile);

    if (!fs.existsSync(outputSchemaDir)) {
      fs.mkdirSync(outputSchemaDir);
    }

    writeFileSync(outputSchemaFile, schemas.combined.schema);
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

  if (!command || typeof command !== "string") {
    print.error(intlMsg.commands_plugin_error_noCommand());
    return false;
  } else if (commands.indexOf(command) === -1) {
    print.error(intlMsg.commands_plugin_error_unknownCommand({ command }));
    return false;
  }

  if (outputSchemaPath === true) {
    const outputSchemaMissingPathMessage = intlMsg.commands_plugin_error_outputDirMissingPath(
      {
        option: "--output-schema-file",
        argument: `<${pathStr}>`,
      }
    );
    print.error(outputSchemaMissingPathMessage);
    print.info(HELP);
    return false;
  } else if (!outputSchemaPath) {
    setOutputSchemaPath(defaultOutputSchemaFile);
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
    setOutputTypesDir(defaultOutputTypesDir);
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
