import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

import { fixParameters } from "../lib/helpers";
import { intlMsg } from "../lib/intl";

export const supportedLangs: { [key: string]: string[] } = {
  build: ["typescript"],
  codegen: ["typescript"],
};

const cmdStr = intlMsg.commands_plugin_options_command();
const optionsStr = intlMsg.commands_options_options();
const langsStr = intlMsg.commands_plugin_options_langs();
const langStr = intlMsg.commands_plugin_options_lang();
const buildStr = intlMsg.commands_plugin_options_build();
const codegenStr = intlMsg.commands_plugin_options_codegen();
const pathStr = intlMsg.commands_plugin_options_path();

const HELP = `
${chalk.bold("w3 plugin")} ${cmdStr} [${optionsStr}]

Commands:
  ${chalk.bold("build")} <${langStr}>     ${buildStr}
    ${langsStr}: ${supportedLangs.build.join(", ")}
  ${chalk.bold("codegen")} <${langStr}>   ${codegenStr}
    ${langsStr}: ${supportedLangs.codegen.join(", ")}

Options:
  -h, --help                        ${intlMsg.commands_plugin_options_h()}
  -s, --output-schema <${pathStr}>  ${intlMsg.commands_plugins_options_schema()}
  -t, --output-types <${pathStr}>   ${intlMsg.commands_plugins_options_types()}
`;

export default {
  alias: ["p"],
  description: intlMsg.commands_plugin_description(),
  run: async (toolbox: GluegunToolbox): Promise<unknown> => {
    const { parameters } = toolbox;

    // Options
    let { help, outputSchema, outputTypes } = parameters.options;
    const { h, s, t } = parameters.options;

    help = help || h;
    outputSchema = outputSchema || s;
    outputTypes = outputTypes || t;

    let type = "";
    let lang = "";
    try {
      const params = parameters;
      [type, lang] = fixParameters(
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
  },
};
