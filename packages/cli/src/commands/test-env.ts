import { startupTestEnv, shutdownTestEnv } from "../lib/env/test";
import { withSpinner } from "../lib/helpers/spinner";
import { getIntl } from "../lib/internationalization";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";
import { defineMessages } from "@formatjs/intl";

const intl = getIntl();

const helpMessages = defineMessages({
  command: {
    id: "commands_testEnv_options_command",
    defaultMessage: "command",
    description: "programming statement that directs computer",
  },
  start: {
    id: "commands_testEnv_options_start",
    defaultMessage: "Startup the test env",
    description: "Start up the testing environment",
  },
  stop: {
    id: "commands_testEnv_options_stop",
    defaultMessage: "Shutdown the test env",
    description: "Shut down the testing environment",
  },
});

const HELP = `
${chalk.bold("w3 test-env")} ${intl.formatMessage(helpMessages.command)}

Commands:
  ${chalk.bold("up")}    ${intl.formatMessage(helpMessages.start)}
  ${chalk.bold("down")}  ${intl.formatMessage(helpMessages.stop)}
`;

export default {
  alias: ["t"],
  description: intl.formatMessage({
    id: "commands_testEnv_description",
    defaultMessage: "Manage a test environment for Web3API",
    description: "description of command 'w3 test-env'",
  }),
  run: async (toolbox: GluegunToolbox): Promise<unknown> => {
    const { parameters } = toolbox;
    const command = parameters.first;

    if (!command) {
      print.error(
        intl.formatMessage({
          id: "commands_testEnv_error_noCommand",
          defaultMessage: "No command given",
          description: "",
        })
      );
      print.info(HELP);
      return;
    }

    if (command !== "up" && command !== "down") {
      const unrecognizedCommandMessage = intl.formatMessage(
        {
          id: "commands_testEnv_error_unrecognizedCommand",
          defaultMessage: "Unrecognized command: {command}",
          description: "",
        },
        {
          command: command,
        }
      );
      print.error(unrecognizedCommandMessage);
      print.info(HELP);
      return;
    }

    if (command === "up") {
      const startMessages = defineMessages({
        text: {
          id: "commands_testEnv_startup_text",
          defaultMessage: "Starting test environment...",
          description: "",
        },
        error: {
          id: "commands_testEnv_startup_error",
          defaultMessage: "Failed to start test environment",
          description: "",
        },
        warning: {
          id: "commands_testEnv_startup_warning",
          defaultMessage: "Warning starting test environment",
          description: "",
        },
      });
      return await withSpinner(
        intl.formatMessage(startMessages.text),
        intl.formatMessage(startMessages.error),
        intl.formatMessage(startMessages.warning),
        async (_spinner) => {
          await startupTestEnv(true);
        }
      );
    } else if (command === "down") {
      const stopMessages = defineMessages({
        text: {
          id: "commands_testEnv_shutdown_text",
          defaultMessage: "Shutting down test environment...",
          description: "",
        },
        error: {
          id: "commands_testEnv_shutdown_error",
          defaultMessage: "Failed to shutdown test environment",
          description: "",
        },
        warning: {
          id: "commands_testEnv_shutdown_warning",
          defaultMessage: "Warning shutting down test environment",
          description: "",
        },
      });
      return await withSpinner(
        intl.formatMessage(stopMessages.text),
        intl.formatMessage(stopMessages.error),
        intl.formatMessage(stopMessages.warning),
        async (_spinner) => {
          await shutdownTestEnv(true);
        }
      );
    } else {
      const neverErrorMessage = intl.formatMessage({
        id: "commands_testEnv_error_never",
        defaultMessage: "This should never happen...",
        description: "",
      });
      throw Error(neverErrorMessage);
    }
  },
};
