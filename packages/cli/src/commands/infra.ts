import { intlMsg, Infra, loadInfraManifest } from "../lib";
import { Command, Program } from "./types";

import { InfraManifest } from "@polywrap/polywrap-manifest-types-js";
import { print } from "gluegun";
import path from "path";
import { Argument } from "commander";
import chalk from "chalk";
import yaml from "js-yaml";
import { readdirSync } from "fs";

type InfraCommandOptions = {
  modules?: string;
  verbose?: boolean;
  manifest: string;
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

const moduleNameStr = intlMsg.commands_infra_moduleName();
const manifestNameStr = intlMsg.commands_infra_options_manifest();

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
        `--manifest  <${manifestNameStr}>`,
        intlMsg.commands_infra_manifestPathDescription(),
        "polywrap.infra.yaml"
      )
      .option(
        `-m, --modules <${moduleNameStr},${moduleNameStr}>`,
        intlMsg.commands_infra_options_m()
      )
      .option("-v, --verbose", intlMsg.commands_infra_options_v())
      .action(async (action, options) => {
        await run(action, options);
      });
  },
};

async function run(
  action: InfraActions,
  options: InfraCommandOptions
): Promise<void> {
  const { modules, verbose, manifest } = options;
  // eslint-disable-next-line prefer-const
  let modulesArray: string[] = [];
  if (modules) {
    modulesArray = modules.split(",").map((m: string) => m.trim());
  }

  const manifestPath = path.resolve(manifest);

  let infraManifest: InfraManifest | undefined;

  try {
    infraManifest = await loadInfraManifest(manifestPath, !verbose);
  } catch (e) {
    if (!modulesArray.length) {
      throw new Error(
        `${e.message}

Tip: If no infra manifest is specified, a default module should be specified using the '--modules' option.

Default Modules: \n${readdirSync(DEFAULT_MODULES_PATH)
          .map((m) => `\n- ${m}`)
          .join("")}

Example: 'polywrap infra up --modules=eth-ens-ipfs'.`
      );
    }
  }

  const infra = new Infra({
    rootDir: path.dirname(manifestPath),
    modulesToUse: modulesArray,
    infraManifest,
    defaultInfraModulesPath: DEFAULT_MODULES_PATH,
    quiet: !verbose,
  });

  const filteredModules = infra.getFilteredModules();

  if (!filteredModules.length) {
    if (modules) {
      const errorMsg = intlMsg.commands_infra_error_noModulesMatch({
        modules,
      });
      print.error(errorMsg);
      return;
    }

    const errorMsg = intlMsg.commands_infra_error_noModulesDeclared();
    print.error(errorMsg);
    return;
  }

  print.info(
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
      print.info(await infra.getVars());
      break;
    case InfraActions.CONFIG:
      print.info(
        yaml.safeDump((await infra.config()).data.config, { indent: 2 })
      );
      break;
    default:
      throw Error(intlMsg.commands_infra_error_never());
  }
}
