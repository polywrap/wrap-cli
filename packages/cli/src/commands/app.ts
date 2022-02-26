/* eslint-disable prefer-const */
import {
  Project,
  AppProject,
  CodeGenerator,
  SchemaComposer
} from "../lib";
import { intlMsg } from "../lib/intl";
import {
  fixParameters,
  loadAppManifest,
  resolvePathIfExists,
  defaultAppManifest
} from "../lib/helpers";
import { getSimpleClient, getDefaultProviders } from "../lib/helpers/client";
import { ImportedWeb3ApiProject } from "../lib/project/ImportedWeb3ApiProject";
import { ImportedPluginProject } from "../lib/project/ImportedPluginProject";

import chalk from "chalk";
import { GluegunToolbox, GluegunPrint } from "gluegun";
import { Web3ApiClient } from "@web3api/client-js";
import { AppManifest } from "@web3api/core-js";
import * as path from "path";

interface AppGenFiles {
  package: string;
  app: string;
}

interface LangGenFiles {
  types: AppGenFiles;
  extension: AppGenFiles;
}

interface AppLangSupport {
  [lang: string]: LangGenFiles;
}

const langSupport: AppLangSupport = {
  "app/typescript": {
    types: {
      package:
        __dirname + "/../lib/codegen-templates/app/types/package-ts.gen.js",
      app: __dirname + "/../lib/codegen-templates/app/types/app-ts.gen.js",
    },
    extension: {
      package:
        __dirname +
        "/../lib/codegen-templates/app/polywrap-app/package-ts.gen.js",
      app:
        __dirname +
        "/../lib/codegen-templates/app/polywrap-app/app-ts.gen.js",
    },
  },
};

const commands = ["codegen"];
const defaultOutputTypesDir = "./polywrap";
const cmdStr = intlMsg.commands_app_options_command();
const optionsStr = intlMsg.commands_options_options();
const codegenStr = intlMsg.commands_app_codegen();
const defaultManifestStr = defaultAppManifest.join(" | ");
const outputTypesDirStr = `${intlMsg.commands_app_options_o({
  default: `${defaultOutputTypesDir}/`,
})}`;
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();

const HELP = `
${chalk.bold("w3 app")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold("codegen")}   ${codegenStr}

Options:
  -h, --help                              ${intlMsg.commands_codegen_options_h()}
  -m, --manifest-file <${pathStr}>              ${intlMsg.commands_codegen_options_m()}: ${defaultManifestStr})
  -t, --output-types-dir <${pathStr}>                 ${outputTypesDirStr}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["a"],
  description: intlMsg.commands_app_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print, middleware } = toolbox;

    // Options
    let {
      help,
      manifestFile,
      outputTypesDir,
      ipfs,
      ens,
    } = parameters.options;
    const { h, m, t, i, e } = parameters.options;

    help = help || h;
    manifestFile = manifestFile || m;
    outputTypesDir = outputTypesDir || t;
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

    const paramsValid = validateAppParams(
      print,
      command,
      outputTypesDir,
      ens
    );

    if (help || !paramsValid) {
      print.info(HELP);
      if (!paramsValid) {
        process.exitCode = 1;
      }
      return;
    }

    // Run Middleware
    await middleware.run({
      name: toolbox.command?.name,
      options: { help, manifestFile, outputTypesDir, ipfs, ens },
    });

    // Resolve manifest
    const manifestPaths = manifestFile ? [manifestFile] : defaultAppManifest;
    manifestFile = resolvePathIfExists(
      filesystem,
      manifestPaths
    );

    if (!manifestFile) {
      print.error(
        intlMsg.commands_app_error_manifestNotFound({
          paths: manifestPaths.join(", ")
        })
      );
      return;
    }

    // App project
    const project = new AppProject({
      rootCacheDir: path.dirname(manifestFile),
      appManifestPath: manifestFile
    });
    await project.validate();

    // Get imported web3api & plugin projects
    const importedProjects = project.getImportedProjects();

    // Generate code for each imported project
    // TODODODODO:

    // Transform packages
    const imports = appManifest.imports?.map((pack) => ({
      uri: sanitizeUri(pack.uri, pack.isPlugin),
      namespace: pack.namespace,
      isPlugin: pack.isPlugin,
    })) || [];

    // types:
    //   directory:
    const outputDirFromManifest: string | undefined =
      appManifest.types.directory;

    //   withExtensions:
    const withExtensions: boolean | undefined = appManifest.types.withExtensions;

    // Resolve output directory
    if (outputTypesDir) {
      outputTypesDir = filesystem.resolve(outputTypesDir);
    } else if (outputDirFromManifest) {
      outputTypesDir = filesystem.resolve(outputDirFromManifest);
    } else {
      outputTypesDir = filesystem.resolve(defaultOutputTypesDir);
    }

    // Resolve generation file
    const langGenFiles: LangGenFiles = langSupport[language];
    const genFiles: AppGenFiles = withExtensions
      ? langGenFiles.extension
      : langGenFiles.types;
    // TODO: does "genFiles.package/app" make sense?
    const packageScript = filesystem.resolve(genFiles.package);
    const appScript = filesystem.resolve(genFiles.app);

    // Get providers and client
    const { ipfsProvider, ethProvider } = await getDefaultProviders(ipfs);
    const ensAddress: string | undefined = ens;
    const client: Web3ApiClient = getSimpleClient({
      ensAddress,
      ethProvider,
      ipfsProvider,
    });

    // Generate code for each Polywrap package
    let result = true;
    for (let i = 0; i < imports.length; i++) {
      const { uri, namespace, isPlugin } = imports[i];

      const project = isPlugin
        ? new ImportedPluginProject({
            rootCacheDir: manifestDir,
            pluginManifestPath: ,
            namespace,
          })
        : new ImportedWeb3ApiProject({
            rootCacheDir: manifestDir,
            uri,
            namespace,
            client,
          });

      const schemaComposer = new SchemaComposer({
        project,
        client,
      });

      const namespaceCodeGenerator = new CodeGenerator({
        project,
        schemaComposer,
        customScript: packageScript,
        outputDir: path.join(outputTypesDir, namespace),
        mustacheView: { uri, namespace },
      });

      // Ensure the target directory is reset
      project.reset();

      if (await namespaceCodeGenerator.generate()) {
        print.success(
          `🔥 ${intlMsg.commands_app_namespace_success({
            content: withExtensions ? "extension" : "types",
            namespace,
          })} 🔥`
        );
      } else {
        result = false;
      }

      // generate shared files on final package
      if (i === imports.length - 1) {
        const appCodeGenerator = new CodeGenerator({
          project,
          schemaComposer,
          customScript: appScript,
          outputDir: path.join(outputTypesDir, namespace),
          mustacheView: { imports },
        });

        if (await appCodeGenerator.generate()) {
          print.success(`🔥 ${intlMsg.commands_app_topLevel_success()} 🔥`);
        } else {
          result = false;
        }
      }
    }

    if (result) {
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
  outputTypesDir: unknown,
  ens: unknown
): boolean {

  if (!command || typeof command !== "string") {
    print.error(intlMsg.commands_app_error_noCommand());
    return false;
  } else if (commands.indexOf(command) === -1) {
    print.error(intlMsg.commands_app_error_unknownCommand({ command }));
    return false;
  }

  if (outputTypesDir === true) {
    const outputDirMissingPathMessage = intlMsg.commands_codegen_error_outputDirMissingPath(
      {
        option: "--output-types-dir",
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

  return true;
}
