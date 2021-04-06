import { fixParameters } from "../lib/helpers";
import { intlMsg } from "../lib/intl";

import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

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
  run: async (toolbox: GluegunToolbox): Promise<void> => {
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

    if (!type) {
      print.error(intlMsg.commands_plugin_error_noCommand());
      print.info(HELP);
      return;
    }

    if (!lang) {
      print.error(intlMsg.commands_plugin_error_noLang());
      print.info(HELP);
      return;
    }

    if (!supportedLangs[type]) {
      const unrecognizedCommand = intlMsg.commands_plugin_error_unrecognizedCommand();
      print.error(`${unrecognizedCommand} "${type}"`);
      print.info(HELP);
      return;
    }

    if (supportedLangs[type].indexOf(lang) === -1) {
      const unrecognizedLanguage = intlMsg.commands_plugin_error_unrecognizedLanguage();
      print.error(`${unrecognizedLanguage} "${lang}"`);
      print.info(HELP);
      return;
    }

    if (outputSchema === true) {
      const outputSchemaMissingPathMessage = intlMsg.commands_plugin_error_outputDirMissingPath(
        {
          option: "--output-schema",
          argument: `<${pathStr}>`,
        }
      );
      print.error(outputSchemaMissingPathMessage);
      print.info(HELP);
      return;
    }

    if (outputTypes === true) {
      const outputTypesMissingPathMessage = intlMsg.commands_plugin_error_outputDirMissingPath(
        {
          option: "--output-types",
          argument: `<${pathStr}>`,
        }
      );
      print.error(outputTypesMissingPathMessage);
      print.info(HELP);
      return;
    }
  },
};
