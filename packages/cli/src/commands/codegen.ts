/* eslint-disable prefer-const */
import {
  CodeGenerator,
  Compiler,
  Web3ApiProject,
  SchemaComposer,
  intlMsg,
  defaultWeb3ApiManifest,
  getTestEnvProviders,
  resolvePathIfExists
} from "../lib";

import chalk from "chalk";
import path from "path";
import { GluegunToolbox, GluegunPrint } from "gluegun";

const optionsStr = intlMsg.commands_options_options();
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();
const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");

const HELP = `
${chalk.bold("w3 codegen")} [${optionsStr}]

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-file <${pathStr}>              ${intlMsg.commands_codegen_options_m({
  default: defaultManifestStr
})}
  -c, --custom <${pathStr}>                     ${intlMsg.commands_codegen_options_c()}
  -o, --custom-output-dir <${pathStr}>          ${intlMsg.commands_codegen_options_o()}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["g"],
  description: intlMsg.commands_codegen_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    const { h, c, m, i, o, e } = parameters.options;
    let {
      help,
      custom,
      customOutputDir,
      manifestFile,
      ipfs,
      ens,
    } = parameters.options;

    help = help || h;
    custom = custom || c;
    manifestFile = manifestFile || m;
    ipfs = ipfs || i;
    customOutputDir = customOutputDir || o;
    ens = ens || e;

    // Validate Params
    const paramsValid = validateCodegenParams(
      print,
      customOutputDir,
      ens,
      custom
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

    // Resolve generation file & output directories
    const customScript = custom && filesystem.resolve(custom);
    manifestFile = resolvePathIfExists(
      filesystem,
      manifestFile ? [manifestFile] : defaultWeb3ApiManifest
    );
    customOutputDir = customOutputDir && filesystem.resolve(customOutputDir);

    const project = new Web3ApiProject({
      rootCacheDir: path.dirname(manifestFile),
      web3apiManifestPath: manifestFile,
    });
    await project.validate();

    const schemaComposer = new SchemaComposer({
      project,
      ipfsProvider,
      ethProvider,
      ensAddress,
    });

    let result = false;

    if (customScript) {
      const codeGenerator = new CodeGenerator({
        project,
        schemaComposer,
        customScript,
        outputDir: customOutputDir || filesystem.path("types"),
      });

      result = await codeGenerator.generate();
    } else {
      const compiler = new Compiler({
        project,
        outputDir: filesystem.path("build"),
        schemaComposer,
      });

      result = await compiler.codegen();
    }

    if (result) {
      print.success(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }
  },
};

function validateCodegenParams(
  print: GluegunPrint,
  customOutputDir: unknown,
  ens: unknown,
  custom: unknown
): boolean {
  if (customOutputDir === true) {
    const outputDirMissingPathMessage = intlMsg.commands_codegen_error_outputDirMissingPath(
      {
        option: "--custom-output-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(outputDirMissingPathMessage);
    return false;
  }

  if (ens === true) {
    const domStr = intlMsg.commands_codegen_error_domain();
    const ensAddressMissingMessage = intlMsg.commands_codegen_error_testEnsAddressMissing(
      {
        option: "--ens",
        argument: `<[${addrStr},]${domStr}>`,
      }
    );
    print.error(ensAddressMissingMessage);
    return false;
  }

  if (custom === true) {
    const customScriptMissingPathMessage = intlMsg.commands_codegen_error_customScriptMissingPath(
      {
        option: "--custom",
        argument: `<${pathStr}>`,
      }
    );
    print.error(customScriptMissingPathMessage);
    return false;
  }

  return true;
}
