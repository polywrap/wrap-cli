/* eslint-disable prefer-const */
import {
  CodeGenerator,
  Compiler,
  Web3ApiProject,
  SchemaComposer,
} from "../lib";
import { intlMsg } from "../lib/intl";

import chalk from "chalk";
import axios from "axios";
import { GluegunToolbox, GluegunFilesystem, GluegunPrint } from "gluegun";

export const defaultManifest = ["web3api.yaml", "web3api.yml"];

const optionsStr = intlMsg.commands_options_options();
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();
const defaultManifestStr = defaultManifest.join(" | ");

const HELP = `
${chalk.bold("w3 codegen")} [${optionsStr}]
${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-path <${pathStr}>              ${intlMsg.commands_codegen_options_m()}: ${defaultManifestStr})
  -c, --custom <${pathStr}>                     ${intlMsg.commands_codegen_options_c()}
  -o, --output-dir <${pathStr}>                 ${intlMsg.commands_codegen_options_o()}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["g"],
  description: intlMsg.commands_codegen_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    const { h, c, m, i, o, e } = parameters.options;
    let {
      help,
      custom,
      manifestPath,
      ipfs,
      outputDir,
      ens,
    } = parameters.options;

    help = help || h;
    custom = custom || c;
    manifestPath = manifestPath || m;
    ipfs = ipfs || i;
    outputDir = outputDir || o;
    ens = ens || e;

    if (help || !validateCodegenParams(print, outputDir, ens)) {
      print.info(HELP);
      return;
    }

    if (custom === true) {
      const customScriptMissingPathMessage = intlMsg.commands_codegen_error_customScriptMissingPath(
        {
          option: "--custom",
          argument: `<${pathStr}>`,
        }
      );
      print.error(customScriptMissingPathMessage);
      print.info(HELP);
      return;
    }

    const { ipfsProvider, ethProvider } = await getCodegenProviders(ipfs);
    const ensAddress: string | undefined = ens;

    // Resolve generation file & output directories
    const customScript = custom && filesystem.resolve(custom);
    manifestPath = await resolveManifestPath(filesystem, manifestPath);
    outputDir = outputDir && filesystem.resolve(outputDir);

    const project = new Web3ApiProject({
      web3apiManifestPath: manifestPath,
    });

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
        outputDir: outputDir || filesystem.path("types"),
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

export function validateCodegenParams(
  print: GluegunPrint,
  outputDir: unknown,
  ens: unknown
): boolean {
  if (outputDir === true) {
    const outputDirMissingPathMessage = intlMsg.commands_build_error_outputDirMissingPath(
      {
        option: "--output-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(outputDirMissingPathMessage);
    return false;
  }

  if (ens === true) {
    const domStr = intlMsg.commands_codegen_error_domain();
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

export async function getCodegenProviders(
  ipfs: unknown
): Promise<{ ipfsProvider?: string; ethProvider?: string }> {
  let ipfsProvider: string | undefined;
  let ethProvider: string | undefined;

  if (typeof ipfs === "string") {
    // Custom IPFS provider
    ipfsProvider = ipfs;
  } else if (ipfs) {
    // Dev-server IPFS provider
    try {
      const {
        data: { ipfs, ethereum },
      } = await axios.get("http://localhost:4040/providers");
      ipfsProvider = ipfs;
      ethProvider = ethereum;
    } catch (e) {
      // Dev server not found
    }
  }
  return { ipfsProvider, ethProvider };
}

export async function resolveManifestPath(
  filesystem: GluegunFilesystem,
  manifestPath: string
): Promise<string> {
  return (
    (manifestPath && filesystem.resolve(manifestPath)) ||
    ((await filesystem.existsAsync(defaultManifest[0]))
      ? filesystem.resolve(defaultManifest[0])
      : filesystem.resolve(defaultManifest[1]))
  );
}
