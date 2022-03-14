/* eslint-disable prefer-const */
import {
  CodeGenerator,
  Compiler,
  Web3ApiProject,
  SchemaComposer,
  intlMsg,
  defaultWeb3ApiManifest,
  getTestEnvProviders,
  resolvePathIfExists,
} from "../lib";

import chalk from "chalk";
import path from "path";
import { GluegunToolbox, GluegunPrint } from "gluegun";

const defaultCodegenDir = "./w3";
const optionsStr = intlMsg.commands_options_options();
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();
const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");

const HELP = `
${chalk.bold("w3 codegen")} [${optionsStr}]

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-file <${pathStr}>              ${intlMsg.commands_codegen_options_m(
  {
    default: defaultManifestStr,
  }
)}
  -c, --codegen-dir <${pathStr}>                ${intlMsg.commands_codegen_options_codegen(
  {
    default: defaultCodegenDir,
  }
)}
  -s, --script <${pathStr}>                     ${intlMsg.commands_codegen_options_s()}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["g"],
  description: intlMsg.commands_codegen_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    const { h, m, c, s, i, e } = parameters.options;
    let {
      help,
      manifestFile,
      codegenDir,
      script,
      ipfs,
      ens,
    } = parameters.options;

    help = help || h;
    manifestFile = manifestFile || m;
    codegenDir = codegenDir || c;
    script = script || s;
    ipfs = ipfs || i;
    ens = ens || e;

    // Validate Params
    const paramsValid = validateCodegenParams(
      print,
      codegenDir,
      (dir: string) => (codegenDir = dir),
      script,
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

    // Resolve manifest file
    manifestFile = resolvePathIfExists(
      filesystem,
      manifestFile ? [manifestFile] : defaultWeb3ApiManifest
    );
    codegenDir = codegenDir && filesystem.resolve(codegenDir);
    script = script && filesystem.resolve(script);

    // Web3Api Project
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

    if (script) {
      const codeGenerator = new CodeGenerator({
        project,
        schemaComposer,
        customScript: script,
        outputDir: codegenDir,
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
  codegenDir: unknown,
  setCodegenDir: (dir: string) => void,
  script: unknown,
  ipfs: unknown,
  ens: unknown
): boolean {
  if (codegenDir === true) {
    const codegenDirMessage = intlMsg.commands_codegen_error_optionMissingArgument(
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

  if (script === true) {
    const customScriptMissingPathMessage = intlMsg.commands_codegen_error_optionMissingArgument(
      {
        option: "--script",
        argument: `<${pathStr}>`,
      }
    );
    print.error(customScriptMissingPathMessage);
    return false;
  }

  if (ipfs === true) {
    const ipfsMissingMessage = intlMsg.commands_codegen_error_optionMissingArgument(
      {
        option: "--ipfs",
        argument: `[<${nodeStr}>]`,
      }
    );
    print.error(ipfsMissingMessage);
    return false;
  }

  if (ens === true) {
    const ensAddressMissingMessage = intlMsg.commands_codegen_error_optionMissingArgument(
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
