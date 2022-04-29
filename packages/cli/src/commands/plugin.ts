/* eslint-disable prefer-const */
import {
  CodeGenerator,
  PluginProject,
  SchemaComposer,
  fixParameters,
  resolvePathIfExists,
  defaultPluginManifest,
  outputManifest,
  intlMsg,
  getTestEnvProviders,
} from "../lib";

import { ComposerFilter } from "@web3api/schema-compose";
import { writeFileSync } from "@web3api/os-js";
import { GluegunPrint, GluegunToolbox, print } from "gluegun";
import chalk from "chalk";
import path from "path";
import fs from "fs";

const commands = ["codegen"];
const defaultPublishDir = "./build";
const defaultCodegenDir = "./src/w3";
const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_commands_codegen();
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
  -p, --publish-dir <${pathStr}>  ${intlMsg.commands_plugin_options_publish({
  default: defaultPublishDir,
})}
  -c, --codegen-dir <${pathStr}>    ${intlMsg.commands_plugin_options_codegen({
  default: defaultCodegenDir,
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
      manifestFile,
      publishDir,
      codegenDir,
      ipfs,
      ens,
    } = parameters.options;
    const { h, m, p, c, i, e } = parameters.options;

    help = help || h;
    manifestFile = manifestFile || m;
    publishDir = publishDir || p;
    codegenDir = codegenDir || c;
    ipfs = ipfs || i;
    ens = ens || e;

    // Command
    let command: string | undefined;
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
      // eslint-disable-next-line no-empty
    } catch (e) {}

    // Validate Params
    const paramsValid = validatePluginParams(
      print,
      command,
      publishDir,
      (dir) => (publishDir = dir),
      codegenDir,
      (dir) => (codegenDir = dir),
      ipfs,
      ens
    );

    if (help || !paramsValid) {
      print.info(HELP);
      if (!paramsValid) {
        process.exitCode = 1;
      }
      return;
    }

    const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
    const ensAddress: string | undefined = ens;

    manifestFile = resolvePathIfExists(
      filesystem,
      manifestFile ? [manifestFile] : defaultPluginManifest
    );
    publishDir = publishDir && filesystem.resolve(publishDir);
    codegenDir = codegenDir && filesystem.resolve(codegenDir);

    // Plugin project
    const project = new PluginProject({
      rootCacheDir: path.dirname(manifestFile),
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
      outputDir: codegenDir,
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
    const publishManifestPath = path.join(publishDir, "web3api.plugin.json");

    if (!fs.existsSync(publishDir)) {
      fs.mkdirSync(publishDir);
    }

    writeFileSync(publishSchemaPath, schemas.combined.schema);
    await outputManifest(manifest, publishManifestPath);
  },
};

function validatePluginParams(
  print: GluegunPrint,
  command: unknown,
  publishDir: unknown,
  setPublishDir: (dir: string) => void,
  codegenDir: unknown,
  setCodegenDir: (dir: string) => void,
  ipfs: unknown,
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

  if (publishDir === true) {
    const publishDirMessage = intlMsg.commands_plugin_error_optionMissingArgument(
      {
        option: "--publish-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(publishDirMessage);
    return false;
  } else if (!publishDir) {
    setPublishDir(defaultPublishDir);
  }

  if (codegenDir === true) {
    const codegenDirMessage = intlMsg.commands_plugin_error_optionMissingArgument(
      {
        option: "--codegen-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(codegenDirMessage);
    return false;
  } else if (!codegenDir) {
    setCodegenDir(defaultCodegenDir);
  }

  if (ipfs === true) {
    const ipfsMissingMessage = intlMsg.commands_plugin_error_optionMissingArgument(
      {
        option: "--ipfs",
        argument: `[<${nodeStr}>]`,
      }
    );
    print.error(ipfsMissingMessage);
    return false;
  }

  if (ens === true) {
    const ensAddressMissingMessage = intlMsg.commands_plugin_error_optionMissingArgument(
      {
        option: "--ens",
        argument: `[<${addrStr}>]`,
      }
    );
    print.error(ensAddressMissingMessage);
    return false;
  }

  return true;
}
