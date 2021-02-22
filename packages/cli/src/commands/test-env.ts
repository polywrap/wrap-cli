import { startupTestEnv, shutdownTestEnv } from "../lib/env/test";
import { withSpinner } from "../lib/helpers/spinner";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const HELP = `
${chalk.bold("w3 test-env")} command

Commands:
  ${chalk.bold("up")}    Startup the test env
  ${chalk.bold("down")}  Shutdown the test env
`;

export default {
  alias: ["t"],
  description: "Manage a test environment for Web3API",
  run: async (toolbox: GluegunToolbox): Promise<unknown> => {
    const { parameters } = toolbox;
    const command = parameters.first;

    if (!command) {
      print.error("No command given");
      print.info(HELP);
      return;
    }

    if (command !== "up" && command !== "down") {
      print.error(`Unrecognized command: ${command}`);
      print.info(HELP);
      return;
    }

    if (command === "up") {
      return await withSpinner(
        "Starting test environment...",
        "Failed to start test environment",
        "Warning starting test environment",
        async (_spinner) => {
          await startupTestEnv(true);
        }
      );
    } else if (command === "down") {
      return await withSpinner(
        "Shutting down test environment...",
        "Failed to shutdown test environment",
        "Warning shutting down test environment",
        async (_spinner) => {
          await shutdownTestEnv(true);
        }
      );
    } else {
      throw Error("This should never happen...");
    }
  },
};
