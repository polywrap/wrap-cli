import { Command, Program, BaseCommandOptions } from "./types";
import { createLogger } from "./utils/createLogger";
import {
  downloadProjectTemplate,
  generateProjectTemplate,
  intlMsg,
  parseLogFileOption,
  parseUrlFormat,
  UrlFormat,
} from "../lib";

import fse from "fs-extra";
import path from "path";
import yesno from "yesno";
import rimraf from "rimraf";
import { Argument } from "commander";

const nameStr = intlMsg.commands_create_options_projectName();
const langStr = intlMsg.commands_create_options_lang();
const langsStr = intlMsg.commands_create_options_langs();
const formatsStr = intlMsg.commands_create_options_formats();
const createProjStr = intlMsg.commands_create_options_createProject();
const createAppStr = intlMsg.commands_create_options_createApp();
const createPluginStr = intlMsg.commands_create_options_createPlugin();
const createTemplateStr = intlMsg.commands_create_options_t();
const pathStr = intlMsg.commands_create_options_o_path();
const urlStr = intlMsg.commands_create_options_t_url();

export const supportedLangs = {
  wasm: [
    "assemblyscript",
    "rust",
    "golang",
    "typescript",
    "interface",
  ] as const,
  app: ["typescript", "python", "rust", "android", "ios"] as const,
  plugin: ["typescript", "rust", "python"] as const,
};

export type ProjectType = keyof typeof supportedLangs;
export type SupportedWasmLangs = typeof supportedLangs.wasm[number];
export type SupportedAppLangs = typeof supportedLangs.app[number];
export type SupportedPluginLangs = typeof supportedLangs.plugin[number];
type SupportedLangs =
  | SupportedWasmLangs
  | SupportedAppLangs
  | SupportedPluginLangs;

export interface CreateCommandOptions extends BaseCommandOptions {
  outputDir: string | false;
}

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
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(
        async (language, name, options: Partial<CreateCommandOptions>) => {
          await run("wasm", language, name, {
            outputDir: options.outputDir || false,
            verbose: options.verbose || false,
            quiet: options.quiet || false,
            logFile: parseLogFileOption(options.logFile),
          });
        }
      );

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
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(
        async (language, name, options: Partial<CreateCommandOptions>) => {
          await run("app", language, name, {
            outputDir: options.outputDir || false,
            verbose: options.verbose || false,
            quiet: options.quiet || false,
            logFile: parseLogFileOption(options.logFile),
          });
        }
      );

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
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(
        async (language, name, options: Partial<CreateCommandOptions>) => {
          await run("plugin", language, name, {
            outputDir: options.outputDir || false,
            verbose: options.verbose || false,
            quiet: options.quiet || false,
            logFile: parseLogFileOption(options.logFile),
          });
        }
      );

    createCommand
      .command("template")
      .description(
        `${createTemplateStr} ${formatsStr}: ${Object.values(UrlFormat).join(
          ", "
        )}`
      )
      .addArgument(new Argument("<url>", urlStr).argRequired())
      .addArgument(new Argument("<name>", nameStr))
      .option(
        `-o, --output-dir <${pathStr}>`,
        `${intlMsg.commands_create_options_o()}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (url, name, options: Partial<CreateCommandOptions>) => {
        await run("template", url, name, {
          outputDir: options.outputDir || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
        });
      });
  },
};

async function run(
  command: ProjectType | "template",
  languageOrUrl: SupportedLangs | string,
  name: string,
  options: Required<CreateCommandOptions>
) {
  const { outputDir, verbose, quiet, logFile } = options;
  const logger = createLogger({ verbose, quiet, logFile });

  // if using custom template, check url validity before creating project dir
  let urlFormat: UrlFormat | undefined;
  if (command === "template") {
    try {
      urlFormat = parseUrlFormat(languageOrUrl);
    } catch (e) {
      logger.error(e.message);
      process.exit(1);
    }
  }

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

  try {
    if (command === "template") {
      await downloadProjectTemplate(
        languageOrUrl,
        projectDir,
        logger,
        urlFormat
      );
    } else {
      await generateProjectTemplate(command, languageOrUrl, projectDir);
    }
    logger.info(`🔥 ${intlMsg.commands_create_ready()} 🔥`);
    process.exit(0);
  } catch (err) {
    const commandFailError = intlMsg.commands_create_error_commandFail({
      error: JSON.stringify(err, null, 2),
    });
    logger.error(commandFailError);
    process.exit(1);
  }
}
