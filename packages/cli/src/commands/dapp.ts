/* eslint-disable prefer-const */
import { CodeGenerator, SchemaComposer, Web3ApiProject } from "../lib";
import { intlMsg } from "../lib/intl";
import {
  getCodegenProviders,
  resolveManifestPath,
  validateCodegenParams,
} from "./codegen";
import { fixParameters } from "../lib/helpers";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";

interface DappLang {
  lang: string;
  typeGenFile: string;
}

const langSupport: DappLang[] = [
  {
    lang: "typescript",
    typeGenFile: __dirname + "/../lib/codegen-templates/types-ts.gen.js",
  },
];

export const defaultManifest = ["web3api.yaml", "web3api.yml"];

const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_plugin_options_codegen();
const defaultManifestStr = defaultManifest.join(" | ");
const defaultOutputTypesStr = "types/";
const outputDirStr = `${intlMsg.commands_plugins_options_types({
  default: defaultOutputTypesStr,
})}`;
const codegenLang = intlMsg.commands_plugin_options_lang();
const outputLangStr = `${intlMsg.commands_dapp_options_l({
  default: langSupport[0].lang,
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

    const { ipfsProvider, ethProvider } = await getCodegenProviders(ipfs);
    const ensAddress: string | undefined = ens;

    // Resolve generation file
    let selectedLang: DappLang | undefined;
    if (typeof lang === "string") {
      const requestedLang = lang.trim().toLowerCase();
      selectedLang = langSupport.find(
        (supported: DappLang) => requestedLang === supported.lang
      );
    } else if (!lang) {
      selectedLang = langSupport[0];
    }
    if (!selectedLang) {
      print.error(intlMsg.commands_dapp_error_noLang());
      print.info(HELP);
      return;
    }
    const customScript = filesystem.resolve(selectedLang.typeGenFile);

    // Resolve manifest and output directories
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
