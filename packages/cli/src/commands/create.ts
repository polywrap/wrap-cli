import { generateProject } from "../lib/generators/project-generator";
import { fixParameters } from "../lib/helpers/parameters";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";

const supportedLangs: { [key: string]: string[] } = {
  api: ["assemblyscript"],
  app: ["react"],
  plugin: ["typescript"],
};

const HELP = `
${chalk.bold("w3 create")} command <project-name> [options]

Commands:
  ${chalk.bold("api")} <lang>     Create a Web3API project
    langs: ${supportedLangs.api.join(", ")}
  ${chalk.bold("app")} <lang>     Create a Web3API application
    langs: ${supportedLangs.app.join(", ")}
  ${chalk.bold("plugin")} <lang>  Create a Web3API application
    langs: ${supportedLangs.plugin.join(", ")}

Options:
  -h, --help               Show usage information
  -o, --output-dir <path>  Output directory for the new project
`;

export default {
  alias: ["c"],
  description: "Create a new project with w3 CLI",
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
      print.error("Please provide a command");
      print.info(HELP);
      return;
    }

    if (!lang) {
      print.error("Please provide a language");
      print.info(HELP);
      return;
    }

    if (!name) {
      print.error("Please provide a project name");
      print.info(HELP);
      return;
    }

    if (!supportedLangs[type]) {
      print.error(`Unrecognized command "${type}"`);
      print.info(HELP);
      return;
    }

    if (supportedLangs[type].indexOf(lang) === -1) {
      print.error(`Unrecognized language "${lang}"`);
      print.info(HELP);
      return;
    }

    if (outputDir === true) {
      print.error("--output-dir option missing <path> argument");
      print.info(HELP);
      return;
    }

    const projectDir = outputDir ? `${outputDir}/${name}` : name;

    // check if project already exists
    if (!filesystem.exists(projectDir)) {
      print.newline();
      print.info(`Setting everything up...`);
    } else {
      print.info(`Directory with name ${projectDir} already exists`);
      const overwrite = await prompt.confirm(
        "Do you want to overwrite this directory?"
      );
      if (overwrite) {
        print.info(`Overwriting ${projectDir}...`);
        filesystem.remove(projectDir);
      } else {
        process.exit(8);
      }
    }

    generateProject(type, lang, projectDir, filesystem)
      .then(() => {
        print.newline();

        if (type === "api") {
          print.info(
            `🔥 You are ready to turn your protocol into a Web3API 🔥`
          );
        } else if (type === "app") {
          print.info(`🔥 You are ready to build a dApp using Web3API 🔥`);
        } else if (type === "plugin") {
          print.info(`🔥 You are ready to build a plugin into a Web3API 🔥`);
        }
      })
      .catch((err) => {
        print.error(`Command failed: ${err.command}`);
      });
  },
};
