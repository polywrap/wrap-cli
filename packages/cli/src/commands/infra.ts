import {
  intlMsg,
  Infra,
  loadInfraManifest,
} from "../lib";
import { Command, Program } from "./types";

import { print } from "gluegun";
import path from "path";
import { Argument } from "commander";
import chalk from "chalk";
import yaml from "js-yaml";

type InfraCommandOptions = {
  modules?: string;
  preset?: string;
  verbose?: boolean;
  manifest: string;
};

enum InfraActions {
  UP = "up",
  DOWN = "down",
  VARS = "vars",
  CONFIG = "config",
}

const moduleNameStr = intlMsg.commands_infra_moduleName();
const presetNameStr = intlMsg.commands_infra_presetName();
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
        "web3api.infra.yaml"
      )
      .option(
        `-m, --modules <${moduleNameStr},${moduleNameStr}>`,
        intlMsg.commands_infra_options_m()
      )
      .option(
        `-p, --preset <${presetNameStr}>`,
        intlMsg.commands_infra_options_p()
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
  const infraManifest = await loadInfraManifest(
    manifestPath,
    !verbose
  );

  const infra = new Infra({
    rootDir: path.dirname(manifestPath),
    modulesToUse: modulesArray,
    infraManifest,
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
      const vars = await infra.getVars();
      print.info(vars);
      break;
    case InfraActions.CONFIG:
      const resultingConfig = await infra.config();
      print.info(
        yaml.safeDump(
          resultingConfig.data.config,
          { indent: 2 }
        )
      );
      break;
    default:
      throw Error(intlMsg.commands_infra_error_never());
  }
}
