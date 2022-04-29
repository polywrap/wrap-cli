import { intlMsg } from "../lib/intl";
import { Web3ApiProject } from "../lib/project";
import { Infra } from "../lib/Infra";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";
import path from "path";

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
    const manifestFile = parameters.second;

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

    const manifestPath =
      (manifestFile && filesystem.resolve(manifestFile)) ||
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

    const project = new Web3ApiProject({
      rootCacheDir: path.dirname(manifestPath),
      web3apiManifestPath: manifestPath,
      quiet: verbose ? false : true,
    });

    const infra = new Infra({
      project,
      packagesToUse: packages,
      quiet: !verbose,
    });

    if (command === "up") {
      await infra.up();
    } else if (command === "down") {
      await infra.down();
    } else if (command === "vars") {
      const vars = await infra.getVars();

      print.info(vars);
    } else if (command === "config") {
      const { stdout } = await infra.config();

      print.info(stdout);
    } else {
      throw Error(intlMsg.commands_infra_error_never());
    }
  },
};
