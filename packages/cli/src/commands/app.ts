/* eslint-disable prefer-const */
import {
  AppProject,
  CodeGenerator,
  SchemaComposer,
  intlMsg,
  fixParameters,
  resolvePathIfExists,
  defaultAppManifest,
  getSimpleClient,
  getTestEnvProviders,
} from "../lib";

import chalk from "chalk";
import { GluegunToolbox, GluegunPrint } from "gluegun";
import { Web3ApiClient } from "@web3api/client-js";
import * as path from "path";

const commands = ["codegen"];
const defaultOutputTypesDir = "./src/w3";
const cmdStr = intlMsg.commands_app_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_app_codegen();
const defaultManifestStr = defaultAppManifest.join(" | ");
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();

const HELP = `
${chalk.bold("w3 app")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold("codegen")}   ${codegenStr}

Options:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-file <${pathStr}>              ${intlMsg.commands_app_options_m(
  {
    default: defaultManifestStr,
  }
)}
  -c, --codegen-dir <${pathStr}>                 ${intlMsg.commands_app_options_codegen(
  {
    default: defaultOutputTypesDir,
  }
)}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["a"],
  description: intlMsg.commands_app_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    let { help, manifestFile, codegenDir, ipfs, ens } = parameters.options;
    const { h, m, c, i, e } = parameters.options;

    help = help || h;
    manifestFile = manifestFile || m;
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

    // Validate Params
    const paramsValid = validateAppParams(
      print,
      command,
      codegenDir,
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

    // Resolve manifest
    const manifestPaths = manifestFile ? [manifestFile] : defaultAppManifest;
    manifestFile = resolvePathIfExists(filesystem, manifestPaths);

    if (!manifestFile) {
      print.error(
        intlMsg.commands_app_error_manifestNotFound({
          paths: manifestPaths.join(", "),
        })
      );
      return;
    }

    // Get providers and client
    const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
    const ensAddress: string | undefined = ens;
    const client: Web3ApiClient = getSimpleClient({
      ensAddress,
      ethProvider,
      ipfsProvider,
    });

    // App project
    const project = new AppProject({
      rootCacheDir: path.dirname(manifestFile),
      appManifestPath: manifestFile,
      client,
    });
    await project.validate();

    if (codegenDir) {
      codegenDir = filesystem.resolve(codegenDir);
    } else {
      codegenDir = filesystem.resolve(defaultOutputTypesDir);
    }

    const schemaComposer = new SchemaComposer({
      project,
      client,
    });
    const codeGenerator = new CodeGenerator({
      project,
      schemaComposer,
      outputDir: codegenDir,
    });

    if (await codeGenerator.generate()) {
      print.success(`🔥 ${intlMsg.commands_app_success()} 🔥`);
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }
  },
};

function validateAppParams(
  print: GluegunPrint,
  command: unknown,
  codegenDir: unknown,
  ipfs: unknown,
  ens: unknown
): boolean {
  if (!command || typeof command !== "string") {
    print.error(intlMsg.commands_app_error_noCommand());
    return false;
  } else if (commands.indexOf(command) === -1) {
    print.error(intlMsg.commands_app_error_unknownCommand({ command }));
    return false;
  }

  if (codegenDir === true) {
    const codegenDirMissingPathMessage = intlMsg.commands_app_error_optionMissingArgument(
      {
        option: "--codegen-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(codegenDirMissingPathMessage);
    return false;
  }

  if (ipfs === true) {
    const ipfsMissingMessage = intlMsg.commands_app_error_optionMissingArgument(
      {
        option: "--ipfs",
        argument: `[<${nodeStr}>]`,
      }
    );
    print.error(ipfsMissingMessage);
    return false;
  }

  if (ens === true) {
    const ensAddressMissingMessage = intlMsg.commands_app_error_optionMissingArgument(
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
