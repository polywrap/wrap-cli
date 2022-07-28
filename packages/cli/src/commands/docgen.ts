/* eslint-disable prefer-const */
import {
  AnyProjectManifest,
  AppProject,
  CodeGenerator,
  defaultAppManifest,
  defaultPolywrapManifest,
  Project,
  SchemaComposer,
  PolywrapProject,
  intlMsg,
  PluginProject,
  parseClientConfigOption,
  defaultPluginManifest,
} from "../lib";
import { Command, Program } from "./types";
import {
  parseDocgenDirOption,
  parseDocgenManifestFileOption,
} from "../lib/option-parsers/docgen";

import path from "path";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import chalk from "chalk";
import { Argument } from "commander";

const commandToPathMap: Record<string, string> = {
  schema: "@polywrap/schema-bind/build/bindings/documentation/schema/index.js",
  docusaurus:
    "@polywrap/schema-bind/build/bindings/documentation/docusaurus/index.js",
  jsdoc: "@polywrap/schema-bind/build/bindings/documentation/jsdoc/index.js",
};

export type DocType = keyof typeof commandToPathMap;

const defaultManifest = defaultPolywrapManifest
  .concat(defaultAppManifest)
  .concat(defaultPluginManifest);
const defaultDocgenDir = "./wrap";
const pathStr = intlMsg.commands_codegen_options_o_path();

type DocgenCommandOptions = {
  manifestFile: string;
  docgenDir: string;
  clientConfig: Partial<PolywrapClientConfig>;
};

enum Actions {
  SCHEMA = "schema",
  DOCUSAURUS = "docusaurus",
  JSDOC = "jsdoc",
}

const argumentsDescription = `
  ${chalk.bold(
    Actions.SCHEMA
  )}        ${intlMsg.commands_docgen_options_schema()}
  ${chalk.bold(
    Actions.DOCUSAURUS
  )}    ${intlMsg.commands_docgen_options_markdown({
  framework: "Docusaurus",
})}
  ${chalk.bold(
    Actions.JSDOC
  )}         ${intlMsg.commands_docgen_options_markdown({
  framework: "JSDoc",
})}
`;

export const docgen: Command = {
  setup: (program: Program) => {
    program
      .command("docgen")
      .alias("o")
      .description(intlMsg.commands_docgen_description())
      .usage("<action> [options]")
      .addArgument(
        new Argument("<action>", argumentsDescription).choices([
          Actions.SCHEMA,
          Actions.DOCUSAURUS,
          Actions.JSDOC,
        ])
      )
      .option(
        `-m, --manifest-file <${pathStr}>`,
        intlMsg.commands_docgen_options_m({
          default: defaultManifest.join(" | "),
        })
      )
      .option(
        `-g, --docgen-dir <${pathStr}>`,
        intlMsg.commands_docgen_options_c({
          default: `${defaultDocgenDir}`,
        })
      )
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .action(async (action, options) => {
        await run(action, {
          ...options,
          manifestFile: parseDocgenManifestFileOption(
            options.manifestFile,
            undefined
          ),
          docgenDir: parseDocgenDirOption(options.docgenDir, undefined),
          clientConfig: await parseClientConfigOption(
            options.clientConfig,
            undefined
          ),
        });
      });
  },
};

async function run(command: DocType, options: DocgenCommandOptions) {
  const { manifestFile, docgenDir, clientConfig } = options;

  const isAppManifest: boolean =
    (<string>manifestFile).toLowerCase().endsWith("polywrap.app.yaml") ||
    (<string>manifestFile).toLowerCase().endsWith("polywrap.app.yml");
  const isPluginManifest: boolean =
    (<string>manifestFile).toLowerCase().endsWith("polywrap.plugin.yaml") ||
    (<string>manifestFile).toLowerCase().endsWith("polywrap.plugin.yml");

  // Resolve custom script
  const customScript = require.resolve(commandToPathMap[command]);

  // Get client
  const client = new PolywrapClient(clientConfig);

  // Get project
  let project: Project<AnyProjectManifest>;
  if (isAppManifest) {
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

  const schemaComposer = new SchemaComposer({
    project,
    client,
  });

  const codeGenerator = new CodeGenerator({
    project,
    schemaComposer,
    customScript,
    codegenDirAbs: docgenDir,
    omitHeader: true,
  });

  if (await codeGenerator.generate()) {
    console.log(`🔥 ${intlMsg.commands_docgen_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
