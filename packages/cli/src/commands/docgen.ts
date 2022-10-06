/* eslint-disable prefer-const */
import {
  AnyProjectManifest,
  AppProject,
  defaultAppManifest,
  defaultPolywrapManifest,
  Project,
  SchemaComposer,
  PolywrapProject,
  intlMsg,
  PluginProject,
  parseClientConfigOption,
  defaultPluginManifest,
  parseDirOption,
  parseDocgenManifestFileOption,
} from "../lib";
import { Command, Program } from "./types";
import { scriptPath as docusaurusScriptPath } from "../lib/docgen/docusaurus";
import { scriptPath as jsdocScriptPath } from "../lib/docgen/jsdoc";
import { scriptPath as schemaScriptPath } from "../lib/docgen/schema";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";

import path from "path";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import chalk from "chalk";
import { Argument } from "commander";

const commandToPathMap: Record<string, string> = {
  schema: schemaScriptPath,
  docusaurus: docusaurusScriptPath,
  jsdoc: jsdocScriptPath,
};

export type DocType = keyof typeof commandToPathMap;

// A list of UNIQUE possible default filenames for the polywrap manifest
const defaultManifest = defaultPolywrapManifest
  .concat(defaultAppManifest)
  .concat(defaultPluginManifest)
  .filter((value, index, self) => self.indexOf(value) === index);
const defaultDocgenDir = "./docs";
const pathStr = intlMsg.commands_codegen_options_o_path();

type DocgenCommandOptions = {
  manifestFile: string;
  docgenDir: string;
  clientConfig: Partial<PolywrapClientConfig>;
  imports: boolean;
};

enum Actions {
  SCHEMA = "schema",
  DOCUSAURUS = "docusaurus",
  JSDOC = "jsdoc",
}

const argumentsDescription = `
  ${chalk.bold(Actions.SCHEMA)}      ${intlMsg.commands_docgen_options_schema()}
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
      .option(`-i, --imports`, `${intlMsg.commands_docgen_options_i()}`)
      .action(async (action, options) => {
        await run(action, {
          ...options,
          manifestFile: parseDocgenManifestFileOption(options.manifestFile),
          docgenDir: parseDirOption(options.docgenDir, defaultDocgenDir),
          clientConfig: await parseClientConfigOption(options.clientConfig),
        });
      });
  },
};

async function run(command: DocType, options: DocgenCommandOptions) {
  const { manifestFile, docgenDir, clientConfig, imports } = options;

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

  const codeGenerator = new ScriptCodegenerator({
    project,
    schemaComposer,
    script: customScript,
    codegenDirAbs: docgenDir,
    omitHeader: true,
    mustacheView: { imports },
  });

  if (await codeGenerator.generate()) {
    console.log(`🔥 ${intlMsg.commands_docgen_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
