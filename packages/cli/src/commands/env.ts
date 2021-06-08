import { withSpinner } from "../lib/helpers/spinner";
import { intlMsg } from "../lib/intl";
import {
  BASE_PACKAGE_JSON,
  exec,
  generateBaseComposedCommand,
  generateBaseDockerCompose,
  getDockerComposePaths,
  installModules,
  Manifest,
  parseManifest,
} from "../lib/env";
import { getEnvVariables } from "../lib/env/envVars";

import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { GluegunToolbox, print } from "gluegun";
import chalk from "chalk";

const TESTENV_DIR_PATH = path.join(".w3", "testenv");
const MODULES_DIR_PATH = path.join(TESTENV_DIR_PATH, "node_modules");
const BASE_COMPOSE_FILE_PATH = path.join(
  TESTENV_DIR_PATH,
  "docker-compose.yml"
);

const HELP = `
${chalk.bold("w3 env")} ${intlMsg.commands_env_options_command()}

Commands:
  ${chalk.bold("up")}    ${intlMsg.commands_env_options_start()}
  ${chalk.bold("down")}  ${intlMsg.commands_env_options_stop()}
  ${chalk.bold("vars")}  ${intlMsg.commands_env_options_env_vars()}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_env_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters } = toolbox;
    const command = parameters.first;
    const { modules: modulesOption, watch, detached } = parameters.options;

    const modulesToUse: string[] | undefined =
      modulesOption && modulesOption.split(",");

    if (!command) {
      print.error(intlMsg.commands_env_error_noCommand());
      print.info(HELP);
      return;
    }

    if (
      command !== "up" &&
      command !== "down" &&
      command !== "vars" &&
      command !== "manifest"
    ) {
      const unrecognizedCommandMessage = intlMsg.commands_env_error_unrecognizedCommand(
        {
          command: command,
        }
      );
      print.error(unrecognizedCommandMessage);
      print.info(HELP);
      return;
    }

    const manifest = parseManifest<Manifest>("./web3api.env.yaml");
    const modules = manifest.modules || {};

    if (fs.existsSync(TESTENV_DIR_PATH)) {
      rimraf.sync(TESTENV_DIR_PATH);
    }

    fs.mkdirSync(TESTENV_DIR_PATH, { recursive: true });

    await installModules(
      BASE_PACKAGE_JSON,
      TESTENV_DIR_PATH,
      Object.values(modules)
    );

    generateBaseDockerCompose(manifest, BASE_COMPOSE_FILE_PATH);

    const modulesPaths = getDockerComposePaths(
      MODULES_DIR_PATH,
      modules,
      modulesToUse
    );

    const baseCommand = generateBaseComposedCommand(
      BASE_COMPOSE_FILE_PATH,
      modulesPaths
    );

    if (command === "up") {
      await exec(`${baseCommand} up ${detached ? "-d" : ""} --build`, watch);
    } else if (command === "down") {
      await exec(`${baseCommand} down`, watch);
    } else if (command === "vars") {
      let vars = "";

      await withSpinner(
        intlMsg.commands_env_vars_text(),
        intlMsg.commands_env_vars_error(),
        intlMsg.commands_env_vars_warning(),
        async (_spinner) => {
          const envVariables = await getEnvVariables(modulesPaths);
          vars = `${envVariables
            .map((variable) => `\n- ${variable}`)
            .join("")}`;
        }
      );

      print.info(vars);
    } else if (command === "manifest") {
      let manifest = "";
      manifest = await exec(`${baseCommand} config`, watch);
      print.info(manifest);
    } else {
      throw Error(intlMsg.commands_env_error_never());
    }
  },
};
