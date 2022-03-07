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
  -c, --codegen-dir <${pathStr}>                 ${intlMsg.commands_app_options_codegen({
  default: defaultOutputTypesDir,
})}
  -i, --ipfs [<${nodeStr}>]                     ${intlMsg.commands_codegen_options_i()}
  -e, --ens [<${addrStr}>]                   ${intlMsg.commands_codegen_options_e()}
`;

export default {
  alias: ["a"],
  description: intlMsg.commands_app_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters, print } = toolbox;

    // Options
    let {
      help,
      manifestFile,
      codegenDir,
      ipfs,
      ens,
    } = parameters.options;
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
      client
    });
    await project.validate();

    // App manifest
    const manifest = await project.getManifest();

    // Resolve output "codegen.directory"
    const outputDirFromManifest = manifest.codegen?.directory;
    if (codegenDir) {
      codegenDir = filesystem.resolve(codegenDir);
    } else if (outputDirFromManifest) {
      codegenDir = filesystem.resolve(outputDirFromManifest);
    } else {
      codegenDir = filesystem.resolve(defaultOutputTypesDir);
    }

    // Resolve "codegen.withExtensions" flag
    //// const withExtensions = manifest.codegen?.withExtensions;

    // Resolve generation file
    const langGenFiles: LangGenFiles = langSupport[manifest.language];
    const genFiles: AppGenFiles = //// withExtensions
      //// ? langGenFiles.extension
      langGenFiles.types;
    // TODO: does "genFiles.package/app" make sense?
    const packageScript = filesystem.resolve(genFiles.package);
    const appScript = filesystem.resolve(genFiles.app);

    // Get imported web3api & plugin dependencies
    const dependencies = await project.getImportedDependencies();

    let result = true;

    // Fail if there are no dependencies
    if (dependencies.length === 0) {
      result = false;
    }

    // Generate code for each imported dependency
    for (const dependency of dependencies) {
      const namespace = dependency.getNamespace();
      const schemaComposer = new SchemaComposer({
        project: dependency,
        client,
      });
      const codeGenerator = new CodeGenerator({
        project: dependency,
        schemaComposer,
        customScript: packageScript,
        outputDir: path.join(codegenDir, namespace),
        mustacheView: { namespace }, //// { uri, namespace },
      });

      if (await codeGenerator.generate()) {
        print.success(
          `🔥 ${intlMsg.commands_app_namespace_success({
            content: "types", //// withExtensions ? "extension" : "types",
            namespace,
          })} 🔥`
        );
      } else {
        result = false;
      }
    }

    // generate shared files using the final package
    if (dependencies.length > 0) {
      const dependency = dependencies[dependencies.length - 1];
      const namespace = dependency.getNamespace();
      const schemaComposer = new SchemaComposer({
        project: dependency,
        client,
      });
      const codeGenerator = new CodeGenerator({
        project: dependency,
        schemaComposer,
        customScript: appScript,
        outputDir: path.join(codegenDir, namespace),
        mustacheView: { dependencies },
      });

      if (await codeGenerator.generate()) {
        print.success(`🔥 ${intlMsg.commands_app_topLevel_success()} 🔥`);
      } else {
        result = false;
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
  codegenDir: unknown,
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
    const codegenDirMissingPathMessage = intlMsg.commands_codegen_error_outputDirMissingPath(
      {
        option: "--codegen-dir",
        argument: `<${pathStr}>`,
      }
    );
    print.error(codegenDirMissingPathMessage);
    return false;
  }

  if (ens === true) {
    const domStr = intlMsg.commands_codegen_error_domain();
    const ensAddressMissingMessage = intlMsg.commands_app_error_optionMissingArgument(
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
