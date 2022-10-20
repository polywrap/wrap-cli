import { Command, Program } from "./types";
import { createLogger } from "./utils/createLogger";
import { generateProjectTemplate, intlMsg } from "../lib";

import fse from "fs-extra";
import path from "path";
import yesno from "yesno";
import rimraf from "rimraf";
import { Argument } from "commander";

const nameStr = intlMsg.commands_create_options_projectName();
const langStr = intlMsg.commands_create_options_lang();
const langsStr = intlMsg.commands_create_options_langs();
const createProjStr = intlMsg.commands_create_options_createProject();
const createAppStr = intlMsg.commands_create_options_createApp();
const createPluginStr = intlMsg.commands_create_options_createPlugin();
const pathStr = intlMsg.commands_create_options_o_path();

export const supportedLangs = {
  wasm: ["assemblyscript", "rust", "interface"] as const,
  app: ["typescript-node", "typescript-react"] as const,
  plugin: ["typescript"] as const,
};

export type ProjectType = keyof typeof supportedLangs;
export type SupportedWasmLangs = typeof supportedLangs.wasm[number];
export type SupportedAppLangs = typeof supportedLangs.app[number];
export type SupportedPluginLangs = typeof supportedLangs.plugin[number];
type SupportedLangs =
  | SupportedWasmLangs
  | SupportedAppLangs
  | SupportedPluginLangs;

export type CreateCommandOptions = {
  outputDir?: string;
  verbose?: boolean;
  quiet?: boolean;
};

export const create: Command = {
  setup: (program: Program) => {
    const createCommand = program
      .command("create")
      .alias("c")
      .description(intlMsg.commands_create_description());

    createCommand
      .command("wasm")
      .description(
        `${createProjStr} ${langsStr}: ${supportedLangs.wasm.join(", ")}`
      )
      .addArgument(
        new Argument("<language>", langStr)
          .choices(supportedLangs.wasm)
          .argRequired()
      )
      .addArgument(new Argument("<name>", nameStr).argRequired())
      .option(
        `-o, --output-dir <${pathStr}>`,
        `${intlMsg.commands_create_options_o()}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .action(async (langStr, nameStr, options) => {
        await run("wasm", langStr, nameStr, options);
      });

    createCommand
      .command("app")
      .description(
        `${createAppStr} ${langsStr}: ${supportedLangs.app.join(", ")}`
      )
      .addArgument(
        new Argument("<language>", langStr)
          .choices(supportedLangs.app)
          .argRequired()
      )
      .addArgument(new Argument("<name>", nameStr).argRequired())
      .option(
        `-o, --output-dir <${pathStr}>`,
        `${intlMsg.commands_create_options_o()}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .action(async (langStr, nameStr, options) => {
        await run("app", langStr, nameStr, options);
      });

    createCommand
      .command(`plugin`)
      .description(
        `${createPluginStr} ${langsStr}: ${supportedLangs.plugin.join(", ")}`
      )
      .addArgument(
        new Argument("<language>", langStr)
          .choices(supportedLangs.plugin)
          .argRequired()
      )
      .addArgument(new Argument("<name>", nameStr).argRequired())
      .option(
        `-o, --output-dir <${pathStr}>`,
        `${intlMsg.commands_create_options_o()}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .action(async (langStr, nameStr, options) => {
        await run("plugin", langStr, nameStr, options);
      });
  },
};

async function run(
  command: ProjectType,
  lang: SupportedLangs,
  name: string,
  options: CreateCommandOptions
) {
  const { outputDir, verbose, quiet } = options;
  const logger = createLogger({ verbose, quiet });

  const projectDir = path.resolve(outputDir ? `${outputDir}/${name}` : name);

  // check if project already exists
  if (!fse.existsSync(projectDir)) {
    logger.info(intlMsg.commands_create_settingUp());
    fse.mkdirSync(projectDir, { recursive: true });
  } else {
    const directoryExistsMessage = intlMsg.commands_create_directoryExists({
      dir: projectDir,
    });
    logger.info(directoryExistsMessage);
    const overwrite = await yesno({
      question: intlMsg.commands_create_overwritePrompt(),
    });
    if (overwrite) {
      const overwritingMessage = intlMsg.commands_create_overwriting({
        dir: projectDir,
      });
      logger.info(overwritingMessage);
      rimraf.sync(projectDir);
    } else {
      process.exit(8);
    }
  }

  await generateProjectTemplate(command, lang, projectDir)
    .then(() => {
      let readyMessage;
      if (command === "wasm") {
        readyMessage = intlMsg.commands_create_readyProtocol();
      } else if (command === "app") {
        readyMessage = intlMsg.commands_create_readyApp();
      } else if (command === "plugin") {
        readyMessage = intlMsg.commands_create_readyPlugin();
      }
      logger.info(`🔥 ${readyMessage} 🔥`);
      process.exit(0);
    })
    .catch((err) => {
      const commandFailError = intlMsg.commands_create_error_commandFail({
        error: JSON.stringify(err, null, 2),
      });
      logger.error(commandFailError);
      process.exit(1);
    });
}
