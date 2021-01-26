import { generateProject } from "../lib/generators/project-generator";

import chalk from "chalk";
import { GluegunToolbox } from "gluegun";
import { fixParameters } from "../lib/helpers/parameters";

const supportedLangs: { [key: string]: string[] } = {
  app: ["react"],
  api: ["assemblyscript"],
};

const HELP = `
${chalk.bold("w3 create")} [options] ${chalk.bold("<project-name>")}

Options:
  -h, --help                         Show usage information
  -t, --type <type>                  Select project type (app, api) (default: api)
  -l, --lang <lang>                  Select project language
                                      app: ${supportedLangs.app.join(", ")}
                                      api: ${supportedLangs.api.join(", ")}
`;

export default {
  alias: ["c"],
  description: "Create a new project with w3 CLI",
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, strings, print, runtime, prompt, filesystem } = toolbox;
    const { isBlank } = strings;

    if (!runtime) {
      print.error("Internal error");
      process.exit(8);
    }

    let { help, type, lang } = parameters.options;
    const { h, t, l } = parameters.options;

    help = help || h;
    type = type || t || "api";
    lang = lang || l;

    let projectName;
    try {
      const params = toolbox.parameters;
      [projectName] = fixParameters(
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

    if (type === true) {
      print.error("--type option missing <type> argument");
      print.info(HELP);
      return;
    } else if (type && type !== "app" && type !== "api") {
      print.error(`Unrecognized --type: ${type}`);
      print.info(HELP);
      return;
    }

    if (lang === true) {
      print.error("--lang option missing <lang> argument");
      print.info(HELP);
      return;
    } else if (type && lang && !supportedLangs[type].includes(lang)) {
      print.error(`Unrecognized --lang: ${lang}`);
      print.info(HELP);
      return;
    } else if (!lang) {
      lang = supportedLangs[type][0];
    }

    if (isBlank(projectName)) {
      print.error("Project name is required");
      print.info(HELP);
      return;
    }

    // check if project already exists
    if (!filesystem.exists(projectName)) {
      print.newline();
      print.info(`Setting up everything...`);

      generateProject(type, lang, projectName, filesystem);

      print.newline();
    } else {
      print.info(`Directory with name ${projectName} already exists`);
      const overwrite = await prompt.confirm("Do you want to overwrite this directory?");
      if (overwrite) {
        print.info(`Overwriting ${projectName}...`);
        filesystem.remove(projectName);
        generateProject(type, lang, projectName, filesystem);
      } else {
        process.exit(8);
      }
    }
    print.info(`🔥 You are ready to turn your Protocol into a Web3API 🔥`);
  },
};
