import { shutdownTestEnv, startupTestEnv } from "../lib/env/test";
import { withSpinner } from "../lib/helpers/spinner";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const HELP = `
${chalk.bold("w3 test-env")} [command]

Commands:
  up    Startup the test env
  down  Shutdown the test env

Options:
  -d, --directory             Directory of docker file(s)
`;

export default {
  alias: ["t"],
  description: "Manage a test environment for Web3API",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { filesystem, parameters } = toolbox;
    const command = parameters.first;
    const { d } = parameters.options;
    let { directory } = parameters.options;

    directory = d || directory || filesystem.cwd();

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
          return startupTestEnv(true, directory);
        }
      );
    } else if (command === "down") {
      return await withSpinner(
        "Shutting down test environment...",
        "Failed to shutdown test environment",
        "Warning shutting down test environment",
        async (_spinner) => {
          return await shutdownTestEnv(true, directory);
        }
      );
    } else {
      throw Error("This should never happen...");
    }
  },
};
