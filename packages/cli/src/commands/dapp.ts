/* eslint-disable prefer-const */
import { CodeGenerator, SchemaComposer, Web3ApiProject } from "../lib";
import { intlMsg } from "../lib/intl";
import {
  getCodegenProviders,
  resolveManifestPath,
  validateCodegenParams,
} from "./codegen";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";

const typescriptGenerationFile =
  __dirname + "/../lib/codegen-templates/types-ts.gen.js";
const defaultGenerationFile = typescriptGenerationFile;
const defaultManifest = ["web3api.yaml", "web3api.yml"];

const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_options_codegen();
const defaultManifestStr = defaultManifest.join(" | ");
const defaultOutputTypesStr = "./types";
const outputDirStr = `${intlMsg.commands_plugins_options_types({
  default: defaultOutputTypesStr,
})}`;
const codegenLang = intlMsg.commands_plugin_options_lang();
const defaultLang = "typescript";
const outputLangStr = `${intlMsg.commands_dapp_options_l({
  default: defaultLang,
})}`;
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();

const HELP = `
${chalk.bold("w3 dapp")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold(
    "codegen"
  )}   ${codegenStr} (${intlMsg.commands_dapp_supported()}: typescript)
  
${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-path <${pathStr}>              ${intlMsg.commands_codegen_options_m()}: ${defaultManifestStr})
  -o, --output-dir <${pathStr}>                 ${outputDirStr}
  -l, --lang <${codegenLang}>                       ${outputLangStr}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["d"],
  description: intlMsg.commands_dapp_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    const { h, m, o, l, i, e } = parameters.options;
    let { help, manifestPath, outputDir, lang, ipfs, ens } = parameters.options;

    help = help || h;
    manifestPath = manifestPath || m;
    outputDir = outputDir || o;
    lang = lang || l;
    ipfs = ipfs || i;
    ens = ens || e;

    if (help || !validateCodegenParams(print, outputDir, ens)) {
      print.info(HELP);
      return;
    }

    const { ipfsProvider, ethProvider } = await getCodegenProviders(ipfs);
    const ensAddress: string | undefined = ens;

    // Resolve generation file & output directories
    const customScript =
      lang && lang.toLowerCase() === "typescript"
        ? filesystem.resolve(typescriptGenerationFile)
        : filesystem.resolve(defaultGenerationFile);
    manifestPath = await resolveManifestPath(filesystem, manifestPath);
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) || filesystem.path("types");

    const project = new Web3ApiProject({
      web3apiManifestPath: manifestPath,
    });

    const schemaComposer = new SchemaComposer({
      project,
      ipfsProvider,
      ethProvider,
      ensAddress,
    });

    const codeGenerator = new CodeGenerator({
      project,
      schemaComposer,
      customScript,
      outputDir,
    });

    if (await codeGenerator.generate()) {
      print.success(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }
  },
};
