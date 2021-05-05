import { fixParameters } from "../lib/helpers/parameters";
import { intlMsg } from "../lib/intl";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";
import { Tracer, LogLevel } from "@web3api/tracing";

const commands = ["up", "down"];
const logLevels = ["debug", "info", "error", "off"];

const HELP = `
${chalk.bold(
  "w3 trace"
)} [${intlMsg.commands_trace_command()}] ${intlMsg.commands_trace_options()}

Commands:
  ${chalk.bold("up")}       ${intlMsg.commands_trace_command_up()}
  ${chalk.bold("down")}     ${intlMsg.commands_trace_command_down()}

Options:
  -l, --level               ${intlMsg.commands_trace_options_level()}
  -h, --help                ${intlMsg.commands_trace_options_help()}
`;

export default {
  alias: ["l"],
  description: intlMsg.commands_trace_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters } = toolbox;
    let { l, level, h, help } = parameters.options;

    level = level || l;
    help = help || h;

    let command;
    try {
      const params = toolbox.parameters;
      [command] = fixParameters(
        {
          options: params.options,
          array: params.array,
        },
        {
          h,
          help,
        }
      );
    } catch (e) {
      print.error(e.message);
      process.exitCode = 1;
      return;
    }

    if (help) {
      print.info(HELP);
      return;
    }

    if (command && commands.indexOf(command) == -1) {
      print.error(
        intlMsg.commands_trace_error_unrecognizedCommand({ command })
      );
      print.info(HELP);
      return;
    }

    if (level && logLevels.indexOf(level) === -1) {
      print.error(
        intlMsg.commands_trace_error_unrecognizedLevel({
          level,
        })
      );
      print.info(HELP);
      return;
    }

    if (command != "down" && !level) {
      level = "debug";
    }

    if (command == "up") {
      try {
        await Tracer.startLoggingServer();
      } catch (err) {
        const commandFailError = intlMsg.commands_trace_error_commandFail({
          error: err.command,
        });
        print.error(commandFailError);

        process.exitCode = 1;
        return;
      }
    }

    Tracer.setLogLevel(level as LogLevel);
    print.success(intlMsg.commands_trace_logLevelSetText({ level }));
  },
};
