/* eslint-disable prefer-const */
import { CodeGenerator, Project, SchemaComposer } from "../lib";
import { intlMsg } from "../lib/intl";
import { getCodegenProviders, validateCodegenParams } from "./codegen";
import {
  fixParameters,
  loadDappManifest,
  manifestLanguageToTargetLanguage,
  resolveManifestPath,
} from "../lib/helpers";
import { getSimpleClient } from "../lib/helpers/client";
import { ExternalWeb3ApiProject } from "../lib/project/ExternalWeb3ApiProject";
import { ExternalPluginProject } from "../lib/project/ExternalPluginProject";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import { Uri, Web3ApiClient } from "@web3api/client-js";
import { DappManifest } from "@web3api/core-js";
import * as path from "path";
import fs from "fs";
import rimraf from "rimraf";

interface PolywrapPackage {
  uri: string;
  namespace: string;
  isPlugin?: boolean;
}

interface DappGenFiles {
  types: string;
  extension: string;
}

interface DappLangSupport {
  [lang: string]: DappGenFiles;
}

const langSupport: DappLangSupport = {
  "plugin-ts": {
    types: __dirname + "/../lib/codegen-templates/dapp/types/types-ts.gen.js",
    extension:
      __dirname +
      "/../lib/codegen-templates/dapp/client-extension/extension-ts.gen.js",
  },
};

const defaultManifest = ["web3api.dapp.yaml", "web3api.dapp.yml"];
const defaultOutputDir = "polywrap";

const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_dapp_codegen();
const defaultManifestStr = defaultManifest.join(" | ");
const outputDirStr = `${intlMsg.commands_dapp_options_o({
  default: `${defaultOutputDir}/`,
})}`;
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();

const HELP = `
${chalk.bold("w3 dapp")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold("codegen")}   ${codegenStr}

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
    } else if (command !== "codegen") {
      print.error(intlMsg.commands_dapp_error_unknownCommand({ command }));
      print.info(HELP);
      return;
    }

    if (!validateCodegenParams(print, outputDir, ens, false)) {
      print.info(HELP);
      return;
    }

    // Resolve manifest
    manifestPath = await resolveManifestPath(
      filesystem,
      manifestPath,
      defaultManifest
    );

    // Dapp project
    const manifestDir: string = path.dirname(manifestPath);
    const dappManifest: DappManifest = await loadDappManifest(
      manifestPath,
      true
    );
    const language: string = dappManifest.language;
    const packages: PolywrapPackage[] = dappManifest.packages;
    const outputDirFromManifest: string | undefined = dappManifest.types.directory;
    const typesOnly: boolean | undefined = dappManifest.types.typesOnly;

    // Resolve output directory
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) || outputDirFromManifest ||
      filesystem.path(defaultOutputDir);

    // Check for duplicate namespaces
    const nsNoDupes: string[] = packages
      .map((pack) => pack.namespace)
      .filter((ns, i, arr) => arr.indexOf(ns) === i);
    if (packages.length !== nsNoDupes.length) {
      print.error(intlMsg.commands_dapp_error_duplicateNs());
      return;
    }

    // Resolve generation file
    const targetLang: string = manifestLanguageToTargetLanguage(language);
    const genFiles: DappGenFiles = langSupport[targetLang];
    const genFilePath: string = typesOnly ? genFiles.types : genFiles.extension;
    const customScript = filesystem.resolve(genFilePath);

    // Get providers and client
    const { ipfsProvider, ethProvider } = await getCodegenProviders(ipfs);
    const ensAddress: string | undefined = ens;
    const client: Web3ApiClient = getSimpleClient({
      ensAddress,
      ethProvider,
      ipfsProvider,
    });

    // Generate code for each Polywrap package
    let result = true;
    for (const pack of packages) {
      const { uri: unsanitizedUri, namespace, isPlugin } = pack;
      const uri: Uri = sanitizeUri(unsanitizedUri, isPlugin);

      const project: Project = isPlugin
        ? new ExternalPluginProject({
            rootPath: manifestDir,
            uri,
            namespace,
            language,
          })
        : new ExternalWeb3ApiProject({
            rootPath: manifestDir,
            uri,
            namespace,
            client,
          });

      const schemaComposer = new SchemaComposer({
        project,
        client,
      });

      const codeGenerator = new CodeGenerator({
        project,
        schemaComposer,
        customScript,
        outputDir: path.join(outputDir, namespace),
        mustacheView: { uri, namespace, packages },
      });

      if (await codeGenerator.generate()) {
        print.success(
          `🔥 ${intlMsg.commands_dapp_namespace_success({
            content: typesOnly ? "types" : "extension",
            namespace,
          })} 🔥`
        );
      } else {
        result = false;
      }

      project.reset();
    }

    // clear empty cache folders
    const cacheDirRoot: string = path.join(manifestDir, ".w3");
    const cacheDir: string = path.join(cacheDirRoot, "ExternalProjects");
    if (await isEmptyDir(cacheDir)) {
      rimraf.sync(cacheDir);
    }
    if (await isEmptyDir(cacheDirRoot)) {
      rimraf.sync(cacheDirRoot);
    }

    if (result) {
      print.success(`🔥 ${intlMsg.commands_dapp_success()} 🔥`);
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }
  },
};

function sanitizeUri(uri: string, isPlugin?: boolean): Uri {
  let result: Uri;
  try {
    result = new Uri(uri);
  } catch (e) {
    // check if the uri is a filepath without a fs/ prefix
    if (!fs.existsSync(uri)) {
      throw e;
    }
    result = new Uri(`w3://fs/${uri}`);
  }
  // convert to absolute path
  if (result.authority === "fs") {
    result = new Uri(`w3://fs/${path.resolve(result.path)}`);
    // plugins must use a filepath uri
  } else if (isPlugin) {
    throw Error(
      `${intlMsg.lib_project_plugin_uri_support()}\n` +
        `w3://fs/./node_modules/myPlugin/\n` +
        `fs/./node_modules/myPlugin/\n` +
        `./node_modules/myPlugin/\n\n` +
        `${intlMsg.lib_project_invalid_uri()}: ${uri}`
    );
  }
  return result;
}

async function isEmptyDir(path: string): Promise<boolean> {
  if (!fs.existsSync(path)) {
    return false;
  }
  const dir = await fs.promises.opendir(path);
  const file = await dir.read();
  await dir.close();
  return file === null;
}
