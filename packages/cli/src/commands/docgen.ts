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
  parseLogFileOption,
  parseWrapperEnvsOption,
} from "../lib";
import { Command, Program, BaseCommandOptions } from "./types";
import { createLogger } from "./utils/createLogger";
import { scriptPath as docusaurusScriptPath } from "../lib/docgen/docusaurus";
import { scriptPath as jsdocScriptPath } from "../lib/docgen/jsdoc";
import { scriptPath as schemaScriptPath } from "../lib/docgen/schema";
import { ScriptCodegenerator } from "../lib/codegen/ScriptCodeGenerator";

import { PolywrapClient } from "@polywrap/client-js";
import chalk from "chalk";
import { Argument } from "commander";

const commandToPathMap: Record<string, string> = {
  schema: schemaScriptPath,
  docusaurus: docusaurusScriptPath,
  jsdoc: jsdocScriptPath,
};

const defaultDocgenDir = "./docs";
const pathStr = intlMsg.commands_codegen_options_o_path();

export enum DocgenActions {
  SCHEMA = "schema",
  DOCUSAURUS = "docusaurus",
  JSDOC = "jsdoc",
}

export interface DocgenCommandOptions extends BaseCommandOptions {
  manifestFile: string;
  docgenDir: string;
  clientConfig: string | false;
  wrapperEnvs: string | false;
  imports: boolean;
}

const argumentsDescription = `
  ${chalk.bold(
    DocgenActions.SCHEMA
  )}      ${intlMsg.commands_docgen_options_schema()}
  ${chalk.bold(
    DocgenActions.DOCUSAURUS
  )}    ${intlMsg.commands_docgen_options_markdown({
  framework: "Docusaurus",
})}
  ${chalk.bold(
    DocgenActions.JSDOC
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
          DocgenActions.SCHEMA,
          DocgenActions.DOCUSAURUS,
          DocgenActions.JSDOC,
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
      .option(
        `--wrapper-envs <${intlMsg.commands_common_options_wrapperEnvsPath()}>`,
        `${intlMsg.commands_common_options_wrapperEnvs()}`
      )
      .option(`-i, --imports`, `${intlMsg.commands_docgen_options_i()}`)
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (action, options: Partial<DocgenCommandOptions>) => {
        await run(action, {
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultProjectManifestFiles
          ),
          docgenDir: parseDirOption(options.docgenDir, defaultDocgenDir),
          clientConfig: options.clientConfig || false,
          wrapperEnvs: options.wrapperEnvs || false,
          imports: options.imports || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
        });
      });
  },
};

async function run(
  action: DocgenActions,
  options: Required<DocgenCommandOptions>
) {
  const {
    manifestFile,
    clientConfig,
    wrapperEnvs,
    docgenDir,
    imports,
    verbose,
    quiet,
    logFile,
  } = options;
  const logger = createLogger({ verbose, quiet, logFile });

  const envs = await parseWrapperEnvsOption(wrapperEnvs);
  const configBuilder = await parseClientConfigOption(clientConfig);

  if (envs) {
    configBuilder.addEnvs(envs);
  }

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
  const customScript = require.resolve(commandToPathMap[action]);

  const client = new PolywrapClient(configBuilder.build(), {
    noDefaults: true,
  });

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
