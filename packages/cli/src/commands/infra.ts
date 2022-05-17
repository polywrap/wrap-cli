import { intlMsg } from "../lib/intl";
import { Web3ApiProject } from "../lib/project";
import { Infra } from "../lib/infra/Infra";
import { getDockerFileLock, loadInfraManifest } from "../lib";

import { GluegunToolbox } from "gluegun";
import chalk from "chalk";
import path from "path";
import { readdirSync } from "fs";

const INFRA_PRESETS = path.join(
  __dirname,
  "..",
  "lib",
  "default-manifests",
  "infra"
);

const optionsStr = intlMsg.commands_infra_options_options();
const manStr = intlMsg.commands_infra_options_manifest();
const moduleNameStr = intlMsg.commands_infra_moduleName();
const presetNameStr = intlMsg.commands_infra_presetName();

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
  -p, --preset <${presetNameStr}>          ${intlMsg.commands_infra_options_p()}
  -v, --verbose                      ${intlMsg.commands_infra_options_v()}
`;

export default {
  alias: ["i"],
  description: intlMsg.commands_infra_description(),
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { parameters, print, filesystem } = toolbox;
    const command = parameters.first;
    const { m, p, v } = parameters.options;
    let { modules, preset, verbose } = parameters.options;
    const manifestFile = parameters.second;

    modules = modules || m;
    preset = preset || p;
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

    if (preset) {
      if (typeof preset !== "string") {
        process.exitCode = 1;
        print.error("'preset' must be a string");
        print.info(HELP);
        return;
      }

      const presets = readdirSync(INFRA_PRESETS);

      if (!presets.includes(preset)) {
        process.exitCode = 1;
        print.error(`'${preset}' is not a supported preset. Supported presets:
        ${presets.map((pr) => `\n- ${pr}`).join("")}\n`);

        return;
      }

      const infraManifest = await loadInfraManifest(
        path.join(INFRA_PRESETS, preset, "web3api.infra.yaml"),
        true
      );

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
        .join("")}\n`
    );

    const dockerLock = getDockerFileLock();
    await dockerLock.request();

    if (command === "up") {
      await infra.up();
      await dockerLock.release();
    } else if (command === "down") {
      await infra.down();
      await dockerLock.release();
    } else if (command === "vars") {
      const vars = await infra.getVars();

      print.info(vars);
      await dockerLock.release();
    } else if (command === "config") {
      const resultingConfig = await infra.config();

      print.info(resultingConfig);
      await dockerLock.release();
    } else {
      await dockerLock.release();
      throw Error(intlMsg.commands_infra_error_never());
    }
  },
};
