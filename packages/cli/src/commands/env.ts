/* eslint-disable @typescript-eslint/no-unused-vars */
// import { withSpinner } from "../lib/helpers/spinner";
import { intlMsg } from "../lib/intl";
// import {
//   BASE_PACKAGE_JSON,
//   exec,
//   generateBaseComposedCommand,
//   generateBaseDockerCompose,
//   getDockerComposePaths,
//   installModules,
//   Manifest,
//   parseManifest,
// } from "../lib/env";
// import { getEnvVariables } from "../lib/env/envVars";
import { fixParameters } from "../lib/helpers";

// import fs from "fs";
// import path from "path";
// import rimraf from "rimraf";
import { Project } from "../lib";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";

// const TESTENV_DIR_PATH = path.join(".w3", "testenv");
// const MODULES_DIR_PATH = path.join(TESTENV_DIR_PATH, "node_modules");
// const BASE_COMPOSE_FILE_PATH = path.join(
//   TESTENV_DIR_PATH,
//   "docker-compose.yml"
// );

const optionsStr = intlMsg.commands_env_options_options();
const manStr = intlMsg.commands_env_options_manifest();
const nodeStr = intlMsg.commands_env_options_i_node();

const cmdStr = intlMsg.commands_create_options_command();
const upStr = intlMsg.commands_env_command_up();
const downStr = intlMsg.commands_env_command_down();
const varsStr = intlMsg.commands_env_command_vars();
const configStr = intlMsg.commands_env_command_config();
const helpStr = intlMsg.commands_env_options_h();

const COMMANDS = ["config", "down", "help", "up", "vars"];

const HELP = `
${chalk.bold("w3 env")} <${cmdStr}> <web3api-${manStr}> [${optionsStr}]

${intlMsg.commands_create_options_commands()}:
  ${chalk.bold("config")}  ${configStr}
  ${chalk.bold("down")}     ${downStr}
  ${chalk.bold("help")}     ${helpStr}
  ${chalk.bold("up")}     ${upStr}
  ${chalk.bold("vars")}  ${varsStr}

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -d, --detached                     ${intlMsg.commands_env_options_d()}
  -m, --modules [<${nodeStr}>]       ${intlMsg.commands_env_options_m()}
  -v, --verbose                      ${intlMsg.commands_env_options_v()}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_env_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, print, filesystem } = toolbox;
    const { d, m, v } = parameters.options;
    let { detached, modules, verbose } = parameters.options;

    detached = detached || d;
    modules = modules || m;
    verbose = verbose || v;

    // const modulesToUse: string[] | undefined = [];
    const params = toolbox.parameters;
    const fixedParameters = fixParameters(
      {
        options: params.options,
        array: params.array,
      },
      {
        d,
        detached,
        m,
        modules,
        v,
        verbose,
      }
    );

    const command = fixedParameters[0];
    let manifestPath = fixedParameters[1];

    if (command === "help") {
      print.info(HELP);
      return;
    }

    if (!command) {
      print.error(intlMsg.commands_env_error_noCommand());
      print.info(HELP);
      return;
    }

    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      filesystem.resolve("web3api.yaml");

    if (!COMMANDS.includes(command)) {
      const unrecognizedCommandMessage = intlMsg.commands_env_error_unrecognizedCommand(
        {
          command: command,
        }
      );
      print.error(unrecognizedCommandMessage);
      print.info(HELP);
      return;
    }

    const project = new Project({
      web3apiManifestPath: manifestPath,
      quiet: verbose ? false : true,
    });

    console.log(project);

    // const manifest = parseManifest<Manifest>("./web3api.env.yaml");
    // const modules = manifest.modules || {};

    // if (fs.existsSync(TESTENV_DIR_PATH)) {
    //   rimraf.sync(TESTENV_DIR_PATH);
    // }

    // fs.mkdirSync(TESTENV_DIR_PATH, { recursive: true });

    // await installModules(
    //   BASE_PACKAGE_JSON,
    //   TESTENV_DIR_PATH,
    //   Object.values(modules)
    // );

    // generateBaseDockerCompose(manifest, BASE_COMPOSE_FILE_PATH);

    // const modulesPaths = getDockerComposePaths(
    //   MODULES_DIR_PATH,
    //   modules,
    //   modulesToUse
    // );

    // const baseCommand = generateBaseComposedCommand(
    //   BASE_COMPOSE_FILE_PATH,
    //   modulesPaths
    // );

    // if (command === "up") {
    //   await exec(`${baseCommand} up ${detached ? "-d" : ""} --build`, watch);
    // } else if (command === "down") {
    //   await exec(`${baseCommand} down`, watch);
    // } else if (command === "vars") {
    //   let vars = "";

    //   await withSpinner(
    //     intlMsg.commands_env_vars_text(),
    //     intlMsg.commands_env_vars_error(),
    //     intlMsg.commands_env_vars_warning(),
    //     async (_spinner) => {
    //       const envVariables = await getEnvVariables(modulesPaths);
    //       vars = `${envVariables
    //         .map((variable) => `\n- ${variable}`)
    //         .join("")}`;
    //     }
    //   );

    //   print.info(vars);
    // } else if (command === "manifest") {
    //   let manifest = "";
    //   manifest = await exec(`${baseCommand} config`, watch);
    //   print.info(manifest);
    // } else {
    //   throw Error(intlMsg.commands_env_error_never());
    // }
  },
};
