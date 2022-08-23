import { Command, Program } from "./types";
import { generateProjectTemplate, intlMsg } from "../lib";

import { Argument } from "commander";
import fse from "fs-extra";
import { createInterface } from "readline";

const prompt = createInterface({
  input: process.stdin,
  output: process.stdout,
});
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
export type SupportedLangs = typeof supportedLangs[ProjectType][number];
type CreateCommandOptions = {
  outputDir?: string;
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
      .action(async (langStr, nameStr, options) => {
        await run("plugin", langStr, nameStr, options);
        process.exit();
      });
  },
};

async function run(
  command: ProjectType,
  lang: SupportedLangs,
  name: string,
  options: CreateCommandOptions
) {
  const { outputDir } = options;

  const projectDir = outputDir ? `${outputDir}/${name}` : name;

  // check if project already exists
  if (!(await fse.readdir(projectDir))) {
    console.log();
    console.info(intlMsg.commands_create_settingUp());
  } else {
    const directoryExistsMessage = intlMsg.commands_create_directoryExists({
      dir: projectDir,
    });
    console.info(directoryExistsMessage);
    prompt.question(
      intlMsg.commands_create_overwritePrompt(),
      async (answer) => {
        if (answer.toLowerCase() === "y") {
          const overwritingMessage = intlMsg.commands_create_overwriting({
            dir: projectDir,
          });
          console.info(overwritingMessage);
          await fse.remove(projectDir);
        } else {
          process.exit(8);
        }
      }
    );
  }

  generateProjectTemplate(command, lang, projectDir)
    .then(() => {
      console.log();
      let readyMessage;
      if (command === "wasm") {
        readyMessage = intlMsg.commands_create_readyProtocol();
      } else if (command === "app") {
        readyMessage = intlMsg.commands_create_readyApp();
      } else if (command === "plugin") {
        readyMessage = intlMsg.commands_create_readyPlugin();
      }
      console.info(`🔥 ${readyMessage} 🔥`);
    })
    .catch((err) => {
      const commandFailError = intlMsg.commands_create_error_commandFail({
        error: err.command,
      });
      console.error(commandFailError);
    });
}
