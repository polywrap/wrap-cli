import { generateProject } from "../lib/generators/project-generator";
import { fixParameters } from "../lib/helpers/parameters";
import { getIntl } from "../lib/internationalization";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import { defineMessages } from "@formatjs/intl";

const intl = getIntl();

const helpMessages = defineMessages({
  h: {
    id: "commands_create_options_h",
    defaultMessage: "Show usage information",
    description: "",
  },
  o: {
    id: "commands_create_options_o",
    defaultMessage: "Output directory for the new project",
    description: "",
  },
  command: {
    id: "commands_create_options_command",
    defaultMessage: "command",
    description: "programming statement that direct computer",
  },
  commands: {
    id: "commands_create_options_commands",
    defaultMessage: "Commands",
    description: "programming statements that direct computer",
  },
  projectName: {
    id: "commands_create_options_projectName",
    defaultMessage: "project-name",
    description: "name of new project user wants to create",
  },
  options: {
    id: "commands_create_options_options",
    defaultMessage: "options",
  },
  lang: {
    id: "commands_create_options_lang",
    defaultMessage: "lang",
    description: "short for 'language'",
  },
  langs: {
    id: "commands_create_options_langs",
    defaultMessage: "langs",
    description: "short for 'languages'",
  },
  createProject: {
    id: "commands_create_options_createProject",
    defaultMessage: "Create a Web3API project",
    description: "create a new software project",
  },
  createApp: {
    id: "commands_create_options_createApp",
    defaultMessage: "Create a Web3API application",
    description: "create a new software application",
  },
  createPlugin: {
    id: "commands_create_options_createPlugin",
    defaultMessage: "Create a Web3API plugin",
    description: "create a new software plugin",
  },
  path: {
    id: "commands_create_options_o_path",
    defaultMessage: "path",
    description: "file path for output",
  },
});
const cmdStr = intl.formatMessage(helpMessages.command);
const nameStr = intl.formatMessage(helpMessages.projectName);
const optionsStr = intl.formatMessage(helpMessages.options);
const langStr = intl.formatMessage(helpMessages.lang);
const langsStr = intl.formatMessage(helpMessages.langs);
const createProjStr = intl.formatMessage(helpMessages.createProject);
const createAppStr = intl.formatMessage(helpMessages.createApp);
const createPluginStr = intl.formatMessage(helpMessages.createPlugin);
const pathStr = intl.formatMessage(helpMessages.path);

export const supportedLangs: { [key: string]: string[] } = {
  api: ["assemblyscript"],
  app: ["react"],
  plugin: ["typescript"],
};

const HELP = `
${chalk.bold("w3 create")} ${cmdStr} <${nameStr}> [${optionsStr}]

${intl.formatMessage(helpMessages.commands)}:
  ${chalk.bold("api")} <${langStr}>     ${createProjStr}
    ${langsStr}: ${supportedLangs.api.join(", ")}
  ${chalk.bold("app")} <${langStr}>     ${createAppStr}
    ${langsStr}: ${supportedLangs.app.join(", ")}
  ${chalk.bold("plugin")} <${langStr}>  ${createPluginStr}
    ${langsStr}: ${supportedLangs.plugin.join(", ")}

Options:
  -h, --help               ${intl.formatMessage(helpMessages.h)}
  -o, --output-dir <${pathStr}>  ${intl.formatMessage(helpMessages.o)}
`;

export default {
  alias: ["c"],
  description: intl.formatMessage({
    id: "commands_create_description",
    defaultMessage: "Create a new project with w3 CLI",
    description: "description of command 'w3 create'",
  }),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, print, prompt, filesystem } = toolbox;

    // Options
    let { help, outputDir } = parameters.options;
    const { h, o } = parameters.options;

    help = help || h;
    outputDir = outputDir || o;

    let type = "";
    let lang = "";
    let name = "";
    try {
      const params = parameters;
      [type, lang, name] = fixParameters(
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
      print.error(
        intl.formatMessage({
          id: "commands_create_error_noCommand",
          defaultMessage: "Please provide a command",
          description: "error message indicating missing command",
        })
      );
      print.info(HELP);
      return;
    }

    if (!lang) {
      print.error(
        intl.formatMessage({
          id: "commands_create_error_noLang",
          defaultMessage: "Please provide a language",
          description: "error message indicating missing language",
        })
      );
      print.info(HELP);
      return;
    }

    if (!name) {
      print.error(
        intl.formatMessage({
          id: "commands_create_error_noName",
          defaultMessage: "Please provide a project name",
          description: "error message indicating missing project name",
        })
      );
      print.info(HELP);
      return;
    }

    if (!supportedLangs[type]) {
      const unrecognizedCommand = intl.formatMessage({
        id: "commands_create_error_unrecognizedCommand",
        defaultMessage: "Unrecognized command",
        description: "error when user provided unrecognized command",
      });
      print.error(`${unrecognizedCommand} "${type}"`);
      print.info(HELP);
      return;
    }

    if (supportedLangs[type].indexOf(lang) === -1) {
      const unrecognizedLanguage = intl.formatMessage({
        id: "commands_create_error_unrecognizedLanguage",
        defaultMessage: "Unrecognized language",
        description: "error when user provided unrecognized language",
      });
      print.error(`${unrecognizedLanguage} "${lang}"`);
      print.info(HELP);
      return;
    }

    if (outputDir === true) {
      const outputDirMissingPathMessage = intl.formatMessage(
        {
          id: "commands_create_error_outputDirMissingPath",
          defaultMessage: "{option} option missing {argument} argument",
          description: "",
        },
        {
          option: "--output-dir",
          argument: `<${intl.formatMessage(helpMessages.path)}>`,
        }
      );
      print.error(outputDirMissingPathMessage);
      print.info(HELP);
      return;
    }

    const projectDir = outputDir ? `${outputDir}/${name}` : name;

    // check if project already exists
    if (!filesystem.exists(projectDir)) {
      print.newline();
      print.info(
        intl.formatMessage({
          id: "commands_create_settingUp",
          defaultMessage: "Setting everything up...",
          description: "",
        })
      );
    } else {
      const directoryExistsMessage = intl.formatMessage(
        {
          id: "commands_create_directoryExists",
          defaultMessage: "Directory with name {dir} already exists",
          description: "",
        },
        {
          dir: projectDir,
        }
      );
      print.info(directoryExistsMessage);
      const overwrite = await prompt.confirm(
        intl.formatMessage({
          id: "commands_create_overwritePrompt",
          defaultMessage: "Do you want to overwrite this directory?",
          description: "",
        })
      );
      if (overwrite) {
        const overwritingMessage = intl.formatMessage(
          {
            id: "commands_create_overwriting",
            defaultMessage: "Overwriting {dir}...",
            description: "",
          },
          {
            dir: projectDir,
          }
        );
        print.info(overwritingMessage);
        filesystem.remove(projectDir);
      } else {
        process.exit(8);
      }
    }

    generateProject(type, lang, projectDir, filesystem)
      .then(() => {
        print.newline();
        let readyMessage;
        if (type === "api") {
          readyMessage = intl.formatMessage({
            id: "commands_create_readyProtocol",
            defaultMessage:
              "You are ready to turn your protocol into a Web3API",
            description: "",
          });
        } else if (type === "app") {
          readyMessage = intl.formatMessage({
            id: "commands_create_readyDapp",
            defaultMessage: "You are ready to build a dApp using Web3API",
            description: "",
          });
        } else if (type === "plugin") {
          readyMessage = intl.formatMessage({
            id: "commands_create_readyPlugin",
            defaultMessage: "You are ready to build a plugin into a Web3API",
            description: "",
          });
        }
        print.info(`🔥 ${readyMessage} 🔥`);
      })
      .catch((err) => {
        const commandFailError = intl.formatMessage(
          {
            id: "commands_create_error_commandFail",
            defaultMessage: "Command failed: {error}",
            description: "",
          },
          {
            error: err.command,
          }
        );
        print.error(commandFailError);
      });
  },
};
