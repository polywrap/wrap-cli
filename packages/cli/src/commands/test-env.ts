import { shutdownTestEnv, startupTestEnv } from "../lib/env/test";
import { withSpinner } from "../lib/helpers/spinner";

import { filesystem, GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const configFileName = "web3api.env.yaml";

const HELP = `
${chalk.bold("w3 test-env")} [command]

Commands:
  up    Startup the test env
  down  Shutdown the test env

Options:
  -c, --ci                         Use test-env package
`;

export default {
  alias: ["t"],
  description: "Manage a test environment for Web3API",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters } = toolbox;
    const command = parameters.first;
    const configFilePath = filesystem.cwd() + `/${configFileName}`;
    const { c } = parameters.options;
    let { ci } = parameters.options;
    ci = ci || c;

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

    if (!ci && filesystem.exists(configFilePath) !== "file") {
      print.error(`No ${configFileName} file found at ${configFilePath}`);
      process.exitCode = 1;
      return;
    }

    if (command === "up") {
      return await withSpinner(
        "Starting test environment...",
        "Failed to start test environment",
        "Warning starting test environment",
        async (_spinner) => {
          return startupTestEnv(true, configFilePath, ci);
        }
      );
    } else if (command === "down") {
      return await withSpinner(
        "Shutting down test environment...",
        "Failed to shutdown test environment",
        "Warning shutting down test environment",
        async (_spinner) => {
          return await shutdownTestEnv(true, configFilePath, ci);
        }
      );
    } else {
      throw Error("This should never happen...");
    }
  },
};
