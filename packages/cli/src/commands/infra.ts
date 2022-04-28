import { intlMsg } from "../lib/intl";
import { withSpinner } from "../lib/helpers";
import { Web3ApiProject } from "../lib/project";
import { Infra } from "../lib/Infra";
import { runCommand } from "../lib/helpers/command";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";
import fs from "fs";

const optionsStr = intlMsg.commands_infra_options_options();
const manStr = intlMsg.commands_infra_options_manifest();
const packageNameStr = intlMsg.commands_infra_packageName();

const cmdStr = intlMsg.commands_create_options_command();
const upStr = intlMsg.commands_infra_command_up();
const downStr = intlMsg.commands_infra_command_down();
const varsStr = intlMsg.commands_infra_command_vars();
const configStr = intlMsg.commands_infra_command_config();
const helpStr = intlMsg.commands_infra_options_h();

const COMMANDS = ["config", "down", "help", "up", "vars"];

const HELP = `
${chalk.bold("w3 infra")} <${cmdStr}> <web3api-${manStr}> [${optionsStr}]

${intlMsg.commands_create_options_commands()}:
  ${chalk.bold("up")}     ${upStr}
  ${chalk.bold("down")}     ${downStr}
  ${chalk.bold("config")}  ${configStr}
  ${chalk.bold("vars")}  ${varsStr}
  ${chalk.bold("help")}     ${helpStr}

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -p, --packages [<${packageNameStr}>]       ${intlMsg.commands_infra_options_m()}
  -v, --verbose                      ${intlMsg.commands_infra_options_v()}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_infra_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, print, filesystem } = toolbox;
    const command = parameters.first;
    const { p, v } = parameters.options;
    let { packages, verbose } = parameters.options;
    let manifestPath = parameters.second;

    packages = packages || p;
    verbose = !!(verbose || v);

    if (packages) {
      packages = packages.split(",").map((m: string) => m.trim());
    }

    if (command === "help") {
      print.info(HELP);
      return;
    }

    if (!command) {
      print.error(intlMsg.commands_infra_error_noCommand());
      print.info(HELP);
      return;
    }

    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      filesystem.resolve("web3api.yaml");

    if (!COMMANDS.includes(command)) {
      const unrecognizedCommandMessage = intlMsg.commands_infra_error_unrecognizedCommand(
        {
          command: command,
        }
      );
      print.error(unrecognizedCommandMessage);
      print.info(HELP);
      return;
    }

    // TODO
    // - create Project w/ web3apimanifestpath & inframanifestpath
    // - create infra w/ project
    // - infra.up()

    const project = new Web3ApiProject({
      web3apiManifestPath: manifestPath,
      quiet: verbose ? false : true,
    });

    const infra = new Infra({
      project,
      packagesToUse: packages
    });


    const infra = await Infra.getInstance({
      web3apiManifestPath: manifestPath,
      quiet: !verbose,
      modulesToUse: modules,
    });

    const manifest = await infra.getInfraManifest();

    if (manifest.modules && modules) {
      const manifestModuleNames = manifest.modules.map((module) => module.name);
      const unrecognizedModules: string[] = [];
      modules.forEach((module: string) => {
        if (!manifestModuleNames.includes(module)) {
          unrecognizedModules.push(module);
        }
      });

      if (unrecognizedModules.length) {
        throw new Error(
          `Unrecognized modules: ${unrecognizedModules.join(", ")}`
        );
      }
    }

    await project.installModules();
    await project.generateBaseDockerCompose();

    const baseCommand = await project.generateBaseComposedCommand();

    if (command === "up") {
      await runCommand(`${baseCommand} up -d --build`, !verbose);
    } else if (command === "down") {
      await runCommand(`${baseCommand} down`, !verbose);
    } else if (command === "vars") {
      let vars = "";

      await withSpinner(
        intlMsg.commands_infra_vars_text(),
        intlMsg.commands_infra_vars_error(),
        intlMsg.commands_infra_vars_warning(),
        async (_spinner) => {
          const envVarRegex = /\${([^}]+)}/gm;
          const composePaths = await project.getCorrectedDockerComposePaths();

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
      const { stdout } = await runCommand(`${baseCommand} config`, !verbose);

      print.info(stdout);
    } else {
      throw Error(intlMsg.commands__error_never());
    }
  },
};
