import { Command, Program } from "./types";
import {
  generateProjectTemplate,
  intlMsg
} from "../lib";


import { prompt, filesystem } from "gluegun";

const nameStr = intlMsg.commands_create_options_projectName();
const langStr = intlMsg.commands_create_options_lang();
const langsStr = intlMsg.commands_create_options_langs();
const createProjStr = intlMsg.commands_create_options_createProject();
const createAppStr = intlMsg.commands_create_options_createApp();
const createPluginStr = intlMsg.commands_create_options_createPlugin();
const pathStr = intlMsg.commands_create_options_o_path();


const supportedLangs: { [key: string]: string[] } = {
  api: ["assemblyscript", "interface"],
  app: ["typescript-node", "typescript-react"],
  plugin: ["typescript"],
};

export const create: Command = {
  setup: (program: Program) => {

    const createCommand = program
      .command("create")
      .alias("c")
      .description(intlMsg.commands_create_description())

    createCommand
      .command(`api <${langStr}> <${nameStr}>`)
      .description(`${createProjStr} ${langsStr}: ${supportedLangs.api.join(", ")}`)
      .option(`-o, --output-dir <${pathStr}>`, `${intlMsg.commands_create_options_o()}`)
      .action(async (langStr, nameStr, options) => {
        await run("api", langStr, nameStr, options);
      });

    createCommand
      .command(`app <${langStr}>`)
      .description(`${createAppStr} ${langsStr}: ${supportedLangs.app.join(", ")}`)
      .option(`-o, --output-dir <${pathStr}>`, `${intlMsg.commands_create_options_o()}`)
      .action(async (langStr, nameStr, options) => {
        await run("app", langStr, nameStr, options);
      });

    createCommand
      .command(`plugin <${langStr}>`)
      .description(`${createPluginStr} ${langsStr}: ${supportedLangs.plugin.join(", ")}`)
      .option(`-o, --output-dir <${pathStr}>`, `${intlMsg.commands_create_options_o()}`)
      .action(async (langStr, nameStr, options) => {
        await run("plugin", langStr, nameStr, options);
      });

  }
}

async function run(command: "api" | "app" | "plugin", lang: any, name: any, options: any) {
  let { outputDir } = options;

  console.log(command, lang, options)
  console.log(outputDir)
  console.log(name);


  const projectDir = outputDir ? `${outputDir}/${name}` : name;

  // check if project already exists
  if (!filesystem.exists(projectDir)) {
    console.log();
    console.info(intlMsg.commands_create_settingUp());
  } else {
    const directoryExistsMessage = intlMsg.commands_create_directoryExists({
      dir: projectDir,
    });
    console.info(directoryExistsMessage);
    const overwrite = await prompt.confirm(
      intlMsg.commands_create_overwritePrompt()
    );
    if (overwrite) {
      const overwritingMessage = intlMsg.commands_create_overwriting({
        dir: projectDir,
      });
      console.info(overwritingMessage);
      filesystem.remove(projectDir);
    } else {
      process.exit(8);
    }
  }

  generateProjectTemplate(command, lang, projectDir, filesystem)
    .then(() => {
      console.log();
      let readyMessage;
      if (command === "api") {
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