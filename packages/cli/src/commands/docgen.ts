/* eslint-disable prefer-const */
import {
  defaultPolywrapManifest,
  SchemaComposer,
  intlMsg,
  parseClientConfigOption,
  parseDirOption,
  parseManifestFileOption,
  defaultProjectManifestFiles,
  getProjectFromManifest,
} from "../lib";
import { Command, Program } from "./types";
import { createLogger } from "./utils/createLogger";
import { scriptPath as docusaurusScriptPath } from "../lib/docgen/docusaurus";
import { scriptPath as jsdocScriptPath } from "../lib/docgen/jsdoc";
import { scriptPath as schemaScriptPath } from "../lib/docgen/schema";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";

import { PolywrapClient, PolywrapCoreClientConfig } from "@polywrap/client-js";
import chalk from "chalk";
import { Argument } from "commander";

const commandToPathMap: Record<string, string> = {
  schema: schemaScriptPath,
  docusaurus: docusaurusScriptPath,
  jsdoc: jsdocScriptPath,
};

export type DocType = keyof typeof commandToPathMap;

const defaultDocgenDir = "./docs";
const pathStr = intlMsg.commands_codegen_options_o_path();

type DocgenCommandOptions = {
  manifestFile: string;
  docgenDir: string;
  clientConfig: PolywrapCoreClientConfig;
  imports: boolean;
  verbose?: boolean;
  quiet?: boolean;
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
          default: defaultPolywrapManifest.join(" | "),
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
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .action(async (action, options) => {
        await run(action, {
          ...options,
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultProjectManifestFiles
          ),
          docgenDir: parseDirOption(options.docgenDir, defaultDocgenDir),
          clientConfig: await parseClientConfigOption(options.clientConfig),
        });
      });
  },
};

async function run(command: DocType, options: DocgenCommandOptions) {
  const {
    manifestFile,
    docgenDir,
    clientConfig,
    imports,
    verbose,
    quiet,
  } = options;
  const logger = createLogger({ verbose, quiet });

  let project = await getProjectFromManifest(manifestFile, logger);

  if (!project) {
    logger.error(
      intlMsg.commands_docgen_error_projectLoadFailed({
        manifestFile: manifestFile,
      })
    );

    process.exit(1);
  }

  await project.validate();

  // Resolve custom script
  const customScript = require.resolve(commandToPathMap[command]);

  const client = new PolywrapClient(clientConfig, { noDefaults: true });

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
    logger.info(`🔥 ${intlMsg.commands_docgen_success()} 🔥`);
    process.exit(0);
  } else {
    process.exit(1);
  }
}
