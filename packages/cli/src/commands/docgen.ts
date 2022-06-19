/* eslint-disable prefer-const */
import {
  AnyManifest,
  AppProject,
  CodeGenerator,
  defaultAppManifest,
  defaultPolywrapManifest,
  getSimpleClient,
  getTestEnvProviders,
  Project,
  SchemaComposer,
  PolywrapProject,
  intlMsg,
  generateProjectTemplate,
  PluginProject,
} from "../lib";
import { Command, Program } from "./types";
import {
  parseDocgenDirOption,
  parseDocgenManifestFileOption,
} from "../lib/option-parsers/docgen";

import { filesystem } from "gluegun";
import path from "path";
import { PolywrapClient } from "@polywrap/client-js";

const commandToPathMap: Record<string, string> = {
  schema: "@web3api/schema-bind/build/bindings/documentation/schema/index.js",
  react: "@web3api/schema-bind/build/bindings/documentation/react/index.js",
  docusaurus:
    "@web3api/schema-bind/build/bindings/documentation/docusaurus/index.js",
  jsdoc: "@web3api/schema-bind/build/bindings/documentation/jsdoc/index.js",
};

export type DocType = keyof typeof commandToPathMap;

const defaultManifest = defaultPolywrapManifest.concat(defaultAppManifest);
const defaultDocgenDir = "./w3";
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();

type DocgenCommandOptions = {
  manifestFile: string;
  codegenDir: string;
  ipfs?: string;
  ens?: string;
};

export const docgen: Command = {
  setup: (program: Program) => {
    const docgenCommand = program
      .command("docgen")
      .alias("d")
      .description(intlMsg.commands_docgen_description())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        intlMsg.commands_docgen_options_m({
          default: defaultManifest.join(" | "),
        })
      )
      .option(
        `-c, --codegen-dir <${pathStr}>`,
        intlMsg.commands_docgen_options_c({
          default: `${defaultDocgenDir}`,
        })
      )
      .option(
        `-i, --ipfs [<${nodeStr}>]`,
        `${intlMsg.commands_codegen_options_i()}`
      )
      .option(
        `-e, --ens [<${addrStr}>]`,
        `${intlMsg.commands_codegen_options_e()}`
      );

    docgenCommand
      .command("schema")
      .description(intlMsg.commands_docgen_options_schema())
      .action(async (options) => {
        await run("schema", options);
      });

    docgenCommand
      .command("docusaurus")
      .description(
        intlMsg.commands_docgen_options_markdown({
          framework: "Docusaurus",
        })
      )
      .action(async (options) => {
        await run("docusaurus", {
          ...options,
          manifestFile: parseDocgenManifestFileOption(
            options.manifestFile,
            undefined
          ),
          codegenDir: parseDocgenDirOption(options.codegenDir, undefined),
        });
      });

    docgenCommand
      .command("jsdoc")
      .description(
        intlMsg.commands_docgen_options_markdown({
          framework: "JSDoc",
        })
      )
      .action(async (options) => {
        await run("jsdoc", options);
      });

    docgenCommand
      .command("react")
      .description(intlMsg.commands_docgen_options_react())
      .action(async (options) => {
        await run("react", options);
      });
  },
};

async function run(command: DocType, options: DocgenCommandOptions) {
  const { ipfs, ens, manifestFile, codegenDir } = options;

  const isAppManifest: boolean =
    (<string>manifestFile).toLowerCase().endsWith("web3api.app.yaml") ||
    (<string>manifestFile).toLowerCase().endsWith("web3api.app.yml");
  const isPluginManifest: boolean =
    (<string>manifestFile).toLowerCase().endsWith("web3api.plugin.yaml") ||
    (<string>manifestFile).toLowerCase().endsWith("web3api.plugin.yml");

  // Resolve custom script
  const customScript = require.resolve(commandToPathMap[command]);

  // Get providers
  const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
  const ensAddress: string | undefined = ens;

  // App or Web3Api project
  let project: Project<AnyManifest>;
  if (isAppManifest) {
    const client: PolywrapClient = getSimpleClient({
      ensAddress,
      ethProvider,
      ipfsProvider,
    });
    project = new AppProject({
      rootDir: path.dirname(manifestFile),
      appManifestPath: manifestFile,
      client,
      quiet: true,
    });
  } else if (isPluginManifest) {
    project = new PluginProject({
      rootDir: path.dirname(manifestFile),
      pluginManifestPath: manifestFile,
      quiet: true,
    });
  } else {
    project = new PolywrapProject({
      rootDir: path.dirname(manifestFile),
      polywrapManifestPath: manifestFile,
      quiet: true,
    });
  }
  await project.validate();

  // Resolve output directory
  let codegenDirAbs: string;
  if (codegenDir) {
    codegenDirAbs = path.resolve(codegenDir);
  } else {
    codegenDirAbs = path.resolve(defaultDocgenDir);
  }

  const schemaComposer = new SchemaComposer({
    project,
    ipfsProvider,
    ethProvider,
    ensAddress,
  });

  if (command === "react") {
    // copy react template and adjust output dir
    const projectDir = path.join(codegenDirAbs, "docusaurus-react-app");
    try {
      await generateProjectTemplate(
        "app",
        "docusaurus",
        projectDir,
        filesystem
      );
    } catch (err) {
      const commandFailError = intlMsg.commands_create_error_commandFail({
        error: err.command,
      });
      console.error(commandFailError);
      process.exitCode = 1;
      return;
    }
    codegenDirAbs = path.join(projectDir, "docs/polywrap");
  }

  const codeGenerator = new CodeGenerator({
    project,
    schemaComposer,
    customScript,
    codegenDirAbs: codegenDirAbs,
    omitHeader: true,
  });

  if (await codeGenerator.generate()) {
    console.log(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
