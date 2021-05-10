import { getAggregatedManifest, up, down } from "../lib/helpers/env";
import { withSpinner } from "../lib/helpers/spinner";
import { intlMsg } from "../lib/intl";
import { getEnvVariables } from "../lib/helpers/env";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const HELP = `
${chalk.bold("w3 env")} ${intlMsg.commands_env_options_command()}

Commands:
  ${chalk.bold("up")}    ${intlMsg.commands_env_options_start()}
  ${chalk.bold("down")}  ${intlMsg.commands_env_options_stop()}
  ${chalk.bold("vars")}  ${intlMsg.commands_env_options_env_vars()}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_env_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters } = toolbox;
    const command = parameters.first;
    const { modules, watch, detached } = parameters.options;

    const modulesToUse: string[] | undefined = modules && modules.split(",");

    if (!command) {
      print.error(intlMsg.commands_env_error_noCommand());
      print.info(HELP);
      return;
    }

    if (
      command !== "up" &&
      command !== "down" &&
      command !== "vars" &&
      command !== "manifest"
    ) {
      const unrecognizedCommandMessage = intlMsg.commands_env_error_unrecognizedCommand(
        {
          command: command,
        }
      );
      print.error(unrecognizedCommandMessage);
      print.info(HELP);
      return;
    }

    if (command === "up") {
      await up({
        modules: modulesToUse,
        watch,
        detached: detached || true,
      });
      // await withSpinner(
      //   intlMsg.commands_env_startup_text(),
      //   intlMsg.commands_env_startup_error(),
      //   intlMsg.commands_env_startup_warning(),
      //   async (_spinner) => {

      //   }
      // );
    } else if (command === "down") {
      await down({
        modules: modulesToUse,
        watch,
      });
      // await withSpinner(
      //   intlMsg.commands_env_shutdown_text(),
      //   intlMsg.commands_env_shutdown_error(),
      //   intlMsg.commands_env_shutdown_warning(),
      //   async (_spinner) => {

      //   }
      // );
    } else if (command === "vars") {
      let vars = "";

      await withSpinner(
        intlMsg.commands_env_vars_text(),
        intlMsg.commands_env_vars_error(),
        intlMsg.commands_env_vars_warning(),
        async (_spinner) => {
          const envVariables = await getEnvVariables({ modules: modulesToUse });
          vars = `${envVariables
            .map((variable) => `\n- ${variable}`)
            .join("")}`;
        }
      );

      print.info(vars);
    } else if (command === "manifest") {
      let manifest = "";
      manifest = await getAggregatedManifest({ modules: modulesToUse });
      await withSpinner(
        intlMsg.commands_env_manifest_text(),
        intlMsg.commands_env_manifest_error(),
        intlMsg.commands_env_manifest_warning(),
        async (_spinner) => {
          manifest = await getAggregatedManifest({ modules: modulesToUse });
        }
      );

      print.info(manifest);
    } else {
      throw Error(intlMsg.commands_env_error_never());
    }
  },
};
