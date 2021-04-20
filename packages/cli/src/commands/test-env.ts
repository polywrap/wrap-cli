import {
  shutdownTestEnv,
  startupTestEnv,
  supportedModules,
} from "../lib/env/test";
import { withSpinner } from "../lib/helpers/spinner";
import { intlMsg } from "../lib/intl";

import { filesystem, GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const configFileName = "web3api.env.yaml";

const HELP = `
${chalk.bold("w3 test-env")} command [modules]

Commands:
${chalk.bold("up")}    Startup the test env
${chalk.bold("down")}  Shutdown the test env

Options:
  -c, --ci                         Use full test-env package

Supported modules: ${supportedModules}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_testEnv_description(),
  run: async (toolbox: GluegunToolbox): Promise<unknown> => {
    const { parameters } = toolbox;
    const command = parameters.first;
    const modules = parameters.array?.slice(1) || new Array<string>();
    const configFilePath = filesystem.cwd() + `/${configFileName}`;
    const { c } = parameters.options;
    let { ci } = parameters.options;
    ci = ci || c;

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

    if (!ci && filesystem.exists(configFilePath) !== "file") {
      print.error(`No ${configFileName} file found at ${configFilePath}`);
      process.exitCode = 1;
      return;
    }

    if (command === "up") {
      return await withSpinner(
        intlMsg.commands_testEnv_startup_text(),
        intlMsg.commands_testEnv_startup_error(),
        intlMsg.commands_testEnv_startup_warning(),
        async (_spinner) => {
          return startupTestEnv(true, configFilePath, ci, modules);
        }
      );
    } else if (command === "down") {
      return await withSpinner(
        intlMsg.commands_testEnv_shutdown_text(),
        intlMsg.commands_testEnv_shutdown_error(),
        intlMsg.commands_testEnv_shutdown_warning(),
        async (_spinner) => {
          return await shutdownTestEnv(true, configFilePath, ci, modules);
        }
      );
    } else {
      throw Error(intlMsg.commands_testEnv_error_never());
    }
  },
};
