import { intlMsg } from "../lib/intl";
import { fixParameters, withSpinner } from "../lib/helpers";
import { EnvProject } from "../lib/EnvProject";
import { runCommand } from "../lib/helpers/command";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";
import fs from "fs";

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

    const project = new EnvProject({
      web3apiManifestPath: manifestPath,
      quiet: verbose ? false : true,
      modulesToUse: modules,
    });

    await project.installModules();
    await project.generateBaseDockerCompose();

    console.log("HERE");

    const baseCommand = await project.generateBaseComposedCommand();

    if (command === "up") {
      await runCommand(
        `${baseCommand} up ${detached ? "-d" : ""} --build`,
        verbose
      );
    } else if (command === "down") {
      await runCommand(`${baseCommand} down`, verbose);
    } else if (command === "vars") {
      let vars = "";

      await withSpinner(
        intlMsg.commands_env_vars_text(),
        intlMsg.commands_env_vars_error(),
        intlMsg.commands_env_vars_warning(),
        async (_spinner) => {
          const envVarRegex = /\${([^}]+)}/gm;
          const composePaths = await project.getDockerComposePaths();

          const envVars = composePaths.reduce((acc, current) => {
            const rawManifest = fs.readFileSync(current, "utf-8");
            const matches = rawManifest.match(envVarRegex) || [];

            return [
              ...acc,
              ...matches.map((match) => {
                if (match.startsWith("$")) {
                  if (match.startsWith("${")) {
                    return match.slice(2, match.length - 1);
                  }

                  return match.slice(1);
                }

                return match;
              }),
            ];
          }, [] as string[]);

          const variables = Array.from(new Set(envVars));

          vars = `${variables.map((variable) => `\n- ${variable}`).join("")}`;
        }
      );

      print.info(vars);
    } else if (command === "config") {
      console.log("RAN");

      const { stdout, stderr } = await runCommand(
        `${baseCommand} config`,
        !verbose
      );

      console.log(stdout, stderr);
      print.info(stdout);
    } else {
      throw Error(intlMsg.commands_env_error_never());
    }
  },
};
