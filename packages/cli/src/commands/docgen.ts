/* eslint-disable prefer-const */
import { CodeGenerator, Project, SchemaComposer } from "../lib";
import { intlMsg } from "../lib/intl";
import {
  getCodegenProviders,
  getGenerationFile,
  resolveManifestPath,
  validateCodegenParams,
} from "./codegen";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";

export const jsdocGenerationFile =
  __dirname + "/../lib/doc-formats/jsdoc.gen.js";
export const defaultGenerationFile = jsdocGenerationFile;
export const defaultManifest = ["web3api.yaml", "web3api.yml"];

const genFileOp = "doc-format";
const optionsStr = intlMsg.commands_options_options();
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();
const defaultManifestStr = defaultManifest.join(" | ");

const HELP = `
${chalk.bold("w3 docgen")} ${chalk.bold(`[<${genFileOp}>]`)} [${optionsStr}]

${intlMsg.commands_docgen_supported()}:
  ${`JSDoc (${intlMsg.commands_docgen_default()})`}

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-path <${pathStr}>              ${intlMsg.commands_codegen_options_m()}: ${defaultManifestStr})
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -o, --output-dir <${pathStr}>                 ${intlMsg.commands_docgen_o()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["d"],
  description: intlMsg.commands_docgen_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    const { h, m, i, o, e } = parameters.options;
    let { help, manifestPath, ipfs, outputDir, ens } = parameters.options;

    help = help || h;
    manifestPath = manifestPath || m;
    ipfs = ipfs || i;
    outputDir = outputDir || o;
    ens = ens || e;

    let generationFile: string | null = getGenerationFile(toolbox);
    if (generationFile === null) {
      return;
    }

    if (help || !validateCodegenParams(print, outputDir, ens)) {
      print.info(HELP);
      return;
    }

    const { ipfsProvider, ethProvider } = await getCodegenProviders(ipfs);
    const ensAddress: string | undefined = ens;

    // Resolve generation file & output directories
    generationFile =
      generationFile && generationFile.toLowerCase() === "jsdoc"
        ? filesystem.resolve(jsdocGenerationFile)
        : filesystem.resolve(defaultGenerationFile);
    manifestPath = await resolveManifestPath(filesystem, manifestPath);
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) || filesystem.path("docs");

    const project = new Project({
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
      generationFile,
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
