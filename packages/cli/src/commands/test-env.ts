import { getAggregatedManifest } from "./../../../testenv/src/index";
import { withSpinner } from "../lib/helpers/spinner";
import { intlMsg } from "../lib/intl";

import { testenv, getEnvVariables } from "@web3api/testenv";
import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const HELP = `
${chalk.bold("w3 test-env")} ${intlMsg.commands_testEnv_options_command()}

Commands:
  ${chalk.bold("up")}    ${intlMsg.commands_testEnv_options_start()}
  ${chalk.bold("down")}  ${intlMsg.commands_testEnv_options_stop()}
  ${chalk.bold("env-vars")}  ${intlMsg.commands_testEnv_options_env_vars()}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_testEnv_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters } = toolbox;
    const command = parameters.first;
    const { modules } = parameters.options;

    const modulesToUse: string[] | undefined = modules && modules.split(",");

    if (!command) {
      print.error(intlMsg.commands_testEnv_error_noCommand());
      print.info(HELP);
      return;
    }

    if (
      command !== "up" &&
      command !== "down" &&
      command !== "env-vars" &&
      command !== "manifest"
    ) {
      const unrecognizedCommandMessage = intlMsg.commands_testEnv_error_unrecognizedCommand(
        {
          command: command,
        }
      );
      print.error(unrecognizedCommandMessage);
      print.info(HELP);
      return;
    }

    if (command === "up") {
      await withSpinner(
        intlMsg.commands_testEnv_startup_text(),
        intlMsg.commands_testEnv_startup_error(),
        intlMsg.commands_testEnv_startup_warning(),
        async (_spinner) => {
          await testenv(true, { modules: modulesToUse });
        }
      );
    } else if (command === "down") {
      await withSpinner(
        intlMsg.commands_testEnv_shutdown_text(),
        intlMsg.commands_testEnv_shutdown_error(),
        intlMsg.commands_testEnv_shutdown_warning(),
        async (_spinner) => {
          await testenv(false, { modules: modulesToUse });
        }
      );
    } else if (command === "env-vars") {
      let envVars = "";

      await withSpinner(
        intlMsg.commands_testEnv_envVars_text(),
        intlMsg.commands_testEnv_envVars_error(),
        intlMsg.commands_testEnv_envVars_warning(),
        async (_spinner) => {
          const vars = await getEnvVariables({ modules: modulesToUse });
          envVars = `${vars.map((variable) => `\n- ${variable}`).join("")}`;
        }
      );

      print.info(envVars);
    } else if (command === "manifest") {
      await withSpinner(
        intlMsg.commands_testEnv_manifest_text(),
        intlMsg.commands_testEnv_manifest_error(),
        intlMsg.commands_testEnv_manifest_warning(),
        async (_spinner) => {
          await getAggregatedManifest({ modules: modulesToUse });
        }
      );
    } else {
      throw Error(intlMsg.commands_testEnv_error_never());
    }
  },
};
