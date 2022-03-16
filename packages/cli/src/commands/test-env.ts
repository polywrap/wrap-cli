import {
  startupTestEnv,
  shutdownTestEnv,
  withSpinner,
  intlMsg,
  isDockerInstalled,
  getDockerFileLock,
} from "../lib";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const HELP = `
${chalk.bold("w3 test-env")} ${intlMsg.commands_testEnv_options_command()}

Commands:
  ${chalk.bold("up")}    ${intlMsg.commands_testEnv_options_start()}
  ${chalk.bold("down")}  ${intlMsg.commands_testEnv_options_stop()}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_testEnv_description(),
  run: async (toolbox: GluegunToolbox): Promise<unknown> => {
    const { parameters } = toolbox;

    // Command
    const command = parameters.first;

    if (!command) {
      print.error(intlMsg.commands_testEnv_error_noCommand());
      print.info(HELP);
      return;
    }

    if (command !== "up" && command !== "down") {
      const unrecognizedCommandMessage = intlMsg.commands_testEnv_error_unrecognizedCommand(
        {
          command: command,
        }
      );
      print.error(unrecognizedCommandMessage);
      print.info(HELP);
      return;
    }

    if (!isDockerInstalled()) {
      print.error(intlMsg.lib_docker_noInstall());
      return;
    }

    const dockerLock = getDockerFileLock();
    await dockerLock.request();

    if (command === "up") {
      return await withSpinner(
        intlMsg.commands_testEnv_startup_text(),
        intlMsg.commands_testEnv_startup_error(),
        intlMsg.commands_testEnv_startup_warning(),
        async (_spinner) => {
          await startupTestEnv(true);
          await dockerLock.release();
        }
      );
    } else if (command === "down") {
      return await withSpinner(
        intlMsg.commands_testEnv_shutdown_text(),
        intlMsg.commands_testEnv_shutdown_error(),
        intlMsg.commands_testEnv_shutdown_warning(),
        async (_spinner) => {
          await shutdownTestEnv(true);
          await dockerLock.release();
        }
      );
    } else {
      await dockerLock.release();
      throw Error(intlMsg.commands_testEnv_error_never());
    }
  },
};
