import { GluegunToolbox } from "gluegun";
import chalk from "chalk";

import { saveAccessToken } from "../lib/user-auth-textile";

const HELP = `
${chalk.dim("Description:")}
Will generate the access token needed to deploy your protocol into IPFS

${chalk.dim("Usage:")}
${chalk.bold("w3 auth")} [options] ${chalk.bold("<protocol-name>")}

${chalk.dim("Options:")}
  -h, --help                    Show usage information
`;

export default {
  description: "Create access token to deploy protocol to IPFS",
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters } = toolbox;
    const { first, options } = parameters;
    const protocol = first;
    const { h, help } = options;

    // Show help text if requested
    if (help || h || !protocol) {
      print.info(HELP);
      return;
    }

    try {
      await saveAccessToken(protocol);
      print.success(`Access token set for ${protocol}`);
    } catch (e) {
      print.error(e);
      process.exitCode = 1;
    }
  },
};
