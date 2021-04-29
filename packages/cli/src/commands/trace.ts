import { intlMsg } from "../lib/intl";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";
import { Tracer, LogLevel } from "@web3api/tracing";

const logLevels = ["debug", "info", "error", "off"];

const HELP = `
${chalk.bold("w3 trace")} ${intlMsg.commands_trace_level()}

Levels:
  ${chalk.bold("debug")}    ${intlMsg.commands_trace_level_debug()}
  ${chalk.bold("info")}     ${intlMsg.commands_trace_level_info()}
  ${chalk.bold("error")}    ${intlMsg.commands_trace_level_error()}
  ${chalk.bold("off")}      ${intlMsg.commands_trace_level_off()}
`;

export default {
  alias: ["l"],
  description: intlMsg.commands_trace_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters } = toolbox;
    const level = parameters.first;

    if (!level) {
      print.error(intlMsg.commands_testEnv_error_noCommand());
      print.info(HELP);
      return;
    }

    if (logLevels.indexOf(level) === -1) {
      const unrecognizedLevelMessage = intlMsg.commands_trace_error_unrecognizedLevel(
        {
          level,
        }
      );
      print.error(unrecognizedLevelMessage);
      print.info(HELP);
      return;
    }

    Tracer.setLogLevel(level as LogLevel);
  },
};
