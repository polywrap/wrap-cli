import { intlMsg } from "../lib/intl";
import { Web3ApiProject } from "../lib/project";
import { Infra } from "../lib/infra/Infra";
import { loadInfraManifest } from "../lib";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";
import path from "path";

const TEST_INFRA_MANIFEST = path.join(
  __dirname,
  "..",
  "lib",
  "default-manifests",
  "infra",
  "dev",
  "web3api.infra.yaml"
);

const optionsStr = intlMsg.commands_infra_options_options();
const manStr = intlMsg.commands_infra_options_manifest();
const moduleNameStr = intlMsg.commands_infra_moduleName();

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
  ${chalk.bold("config")}  ${configStr}
  ${chalk.bold("down")}     ${downStr}
  ${chalk.bold("help")}     ${helpStr}
  ${chalk.bold("up")}     ${upStr}
  ${chalk.bold("vars")}  ${varsStr}

${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
  -m, --modules [<${moduleNameStr}>]       ${intlMsg.commands_infra_options_m()}
  -t, --test                         ${intlMsg.commands_infra_options_t()}
  -v, --verbose                      ${intlMsg.commands_infra_options_v()}
`;

export default {
  alias: ["t"],
  description: intlMsg.commands_infra_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, print, filesystem } = toolbox;
    const command = parameters.first;
    const { m, t, v } = parameters.options;
    let { modules, test, verbose } = parameters.options;
    const manifestFile = parameters.second;

    modules = modules || m;
    test = test || t;
    verbose = !!(verbose || v);

    if (modules) {
      modules = modules.split(",").map((m: string) => m.trim());
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

    let infra: Infra;

    if (test) {
      const infraManifest = await loadInfraManifest(TEST_INFRA_MANIFEST, true);

      infra = new Infra({
        project,
        infraManifest,
        quiet: !verbose,
      });
    } else {
      const infraManifest = await project.getInfraManifest();

      infra = new Infra({
        project,
        modulesToUse: modules,
        infraManifest,
        quiet: !verbose,
      });
    }

    const filteredModules = infra.getFilteredModules();

    if (!filteredModules.length) {
      if (modules) {
        const errorMsg = intlMsg.commands_infra_error_noModulesMatch({
          modules,
        });
        print.error(errorMsg);
        return;
      }

      const errorMsg = intlMsg.commands_infra_error_noModulesDeclared();
      print.error(errorMsg);
      return;
    }

    print.info(
      `${intlMsg.commands_infra_modulesUsed_text()}: ${filteredModules
        .map((f) => `\n- ${f.name}`)
        .join("")}`
    );

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
