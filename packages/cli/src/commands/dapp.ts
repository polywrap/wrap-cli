/* eslint-disable prefer-const */
import { CodeGenerator, SchemaComposer } from "../lib";
import { intlMsg } from "../lib/intl";
import {
  getCodegenProviders,
  resolveManifestPath,
  validateCodegenParams,
} from "./codegen";
import { fixParameters, loadDappManifest, manifestLanguageToTargetLanguage } from "../lib/helpers";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import { getSimpleClient } from "../lib/helpers/client";
import { ExternalWeb3ApiProject } from "../lib/project/ExternalWeb3ApiProject";
import { Web3ApiClient } from "@web3api/client-js";
import { DappManifest } from "@web3api/core-js";

interface PolywrapPackage {
  uri: string;
  namespace: string;
}

interface DappGenFiles {
  types: string;
  extension: string;
}

interface DappLangSupport {
  [lang: string]: DappGenFiles
}

const langSupport: DappLangSupport = {
  "plugin-ts": {
    types: __dirname + "/../lib/codegen-templates/types-ts.gen.js",
    extension: __dirname + "/../lib/codegen-templates/extension-ts.gen.js",
  }
};

export const defaultManifest = ["web3api.dapp.yaml", "web3api.dapp.yml"];

const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_options_codegen();
const codegenExtensionStr = "Generate code for client extension";
const defaultManifestStr = defaultManifest.join(" | ");
const defaultOutputTypesStr = "types/";
const outputDirStr = `${intlMsg.commands_plugins_options_types({
  default: defaultOutputTypesStr,
})}`;
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();

const HELP = `
${chalk.bold("w3 dapp")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold("types")}   ${codegenStr}
  ${chalk.bold("extension")}   ${codegenExtensionStr}

Options:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-path <${pathStr}>              ${intlMsg.commands_codegen_options_m()}: ${defaultManifestStr})
  -o, --output-dir <${pathStr}>                 ${outputDirStr}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["d"],
  description: intlMsg.commands_dapp_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    const { h, m, o, i, e } = parameters.options;
    let { help, manifestPath, outputDir, ipfs, ens } = parameters.options;

    help = help || h;
    manifestPath = manifestPath || m;
    outputDir = outputDir || o;
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

    if (!validateCodegenParams(print, outputDir, ens, false)) {
      print.info(HELP);
      return;
    }

    // Resolve manifest and output directories
    manifestPath = await resolveManifestPath(filesystem, manifestPath);
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) || filesystem.path("dapp");

    // Dapp project
    const dappManifest: DappManifest = await loadDappManifest(manifestPath, true);
    const lang: string = manifestLanguageToTargetLanguage(dappManifest.language);
    const packages: PolywrapPackage[] = dappManifest.packages;

    // Resolve generation file
    const genFiles: DappGenFiles = langSupport[lang];
    const genFilePath: string = command === "extension" ? genFiles.extension : genFiles.types;
    const customScript = filesystem.resolve(genFilePath);

    // Get providers and client
    const { ipfsProvider, ethProvider } = await getCodegenProviders(ipfs);
    const ensAddress: string | undefined = ens;
    const client: Web3ApiClient = getSimpleClient({ ensAddress, ethProvider, ipfsProvider });

    // Generate code for each Polywrap package
    let result: boolean = true;
    for (const pack of packages) {

      const project: ExternalWeb3ApiProject = new ExternalWeb3ApiProject({
        uri: pack.uri,
        namespace: pack.namespace,
        client
      });

      const schemaComposer = new SchemaComposer({
        project,
        client,
      });

      const codeGenerator = new CodeGenerator({
        project,
        schemaComposer,
        customScript,
        outputDir,
      });

      if (await codeGenerator.generate()) {
        print.success(`🔥 ${`Generated code for namespace ${pack.namespace}`} 🔥`);
      } else {
        result = false;
      }
    }

    if (result) {
      print.success(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }
  },
};
