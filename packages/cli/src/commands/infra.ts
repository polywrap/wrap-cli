import {
  intlMsg,
  Infra,
  loadInfraManifest,
  defaultInfraManifest,
  resolvePathIfExists,
  parseLogFileOption,
} from "../lib";
import { createLogger } from "./utils/createLogger";
import { Command, Program } from "./types";

import { InfraManifest } from "@polywrap/polywrap-manifest-types-js";
import path from "path";
import { Argument } from "commander";
import chalk from "chalk";
import yaml from "yaml";
import { readdirSync } from "fs";

type InfraCommandOptions = {
  modules?: string;
  verbose?: boolean;
  quiet?: boolean;
  manifest: string;
  logFile?: string;
};

enum InfraActions {
  UP = "up",
  DOWN = "down",
  VARS = "vars",
  CONFIG = "config",
}

const DEFAULT_MODULES_PATH = path.join(
  __dirname,
  "..",
  "lib",
  "defaults",
  "infra-modules"
);

const defaultManifestStr = defaultInfraManifest.join(" | ");
const pathStr = intlMsg.commands_infra_options_m_path();
const moduleNameStr = intlMsg.commands_infra_options_o_module();

const argumentsDescription = `
  ${intlMsg.commands_infra_actions_subtitle()}
  ${chalk.bold(InfraActions.UP)}      ${intlMsg.commands_infra_command_up()}
  ${chalk.bold(InfraActions.DOWN)}    ${intlMsg.commands_infra_command_down()}
  ${chalk.bold(
    InfraActions.CONFIG
  )}   ${intlMsg.commands_infra_command_config()}
  ${chalk.bold(InfraActions.VARS)}     ${intlMsg.commands_infra_command_vars()}
`;

export const infra: Command = {
  setup: (program: Program) => {
    program
      .command("infra")
      .alias("i")
      .description(intlMsg.commands_infra_description())
      .usage("<action> [options]")
      .addArgument(
        new Argument("<action>", argumentsDescription).choices([
          InfraActions.UP,
          InfraActions.DOWN,
          InfraActions.VARS,
          InfraActions.CONFIG,
        ])
      )
      .showHelpAfterError(true)
      .option(
        `-m, --manifest-file  <${pathStr}>`,
        intlMsg.commands_infra_options_m({
          default: defaultManifestStr,
        })
      )
      .option(
        `-o, --modules <${moduleNameStr},${moduleNameStr}>`,
        intlMsg.commands_infra_options_o()
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_s()}`
      )
      .action(async (action, options) => {
        await run(action, {
          ...options,
          manifest: options.manifestFile
            ? [options.manifestFile]
            : defaultInfraManifest,
          logFile: parseLogFileOption(options.logFile),
        });
      });
  },
};

const tip = `Tip: If no infra manifest is specified, a default module should be specified using the '--modules' option.

Default Modules: \n${readdirSync(DEFAULT_MODULES_PATH)
  .map((m) => `\n- ${m}`)
  .join("")}

Example: 'polywrap infra up --modules=eth-ens-ipfs'.`;

async function run(
  action: InfraActions,
  options: InfraCommandOptions & { manifest: string[] }
): Promise<void> {
  const { modules, verbose, quiet, manifest, logFile } = options;

  const logger = createLogger({ verbose, quiet, logFile });

  // eslint-disable-next-line prefer-const
  let modulesArray: string[] = [];
  if (modules) {
    modulesArray = modules.split(",").map((m: string) => m.trim());
  }

  const manifestPath = resolvePathIfExists(manifest);

  let infraManifest: InfraManifest | undefined;

  if (manifestPath) {
    try {
      infraManifest = await loadInfraManifest(manifestPath, logger);
    } catch (e) {
      if (!modulesArray.length) {
        throw new Error(`${e.message}\n\n${tip}`);
      } else {
        throw new Error(e.message);
      }
    }
  } else if (!modulesArray.length) {
    throw new Error(tip);
  }

  const infra = new Infra({
    rootDir: manifestPath ? path.dirname(manifestPath) : process.cwd(),
    modulesToUse: modulesArray,
    infraManifest,
    defaultInfraModulesPath: DEFAULT_MODULES_PATH,
    logger,
  });

  const filteredModules = infra.getFilteredModules();

  if (!filteredModules.length) {
    if (modules) {
      const errorMsg = intlMsg.commands_infra_error_noModulesMatch({
        modules,
      });
      logger.error(errorMsg);
      return;
    }

    const errorMsg = intlMsg.commands_infra_error_noModulesDeclared();
    logger.error(errorMsg);
    return;
  }

  logger.info(
    `${intlMsg.commands_infra_modulesUsed_text()}: ${filteredModules
      .map((f) => `\n- ${f.name}`)
      .join("")}\n`
  );

  switch (action) {
    case InfraActions.UP:
      await infra.up();
      break;
    case InfraActions.DOWN:
      await infra.down();
      break;
    case InfraActions.VARS:
      logger.info(JSON.stringify(await infra.getVars(), null, 2));
      break;
    case InfraActions.CONFIG:
      logger.info(yaml.stringify((await infra.config()).data.config, null, 2));
      break;
    default:
      throw Error(intlMsg.commands_infra_error_never());
  }
  process.exit(0);
}
