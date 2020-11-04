import { CodeGenerator } from "../lib/CodeGenerator";
import { fixParameters } from "../lib/helpers/parameters";

import path from "path";
import chalk from "chalk";
import { GluegunToolbox } from "gluegun";

const HELP = `
${chalk.bold('w3 codegen')} [options] ${chalk.bold('[<web3api-manifest>]')}

Options:
  -h, --help                 Show usage information
  -o, --output-dir <path>    Output directory for generated code (default: src/generated)
  -l, --language <language>  Language to generate
`;

export default {
  alias: ["c"],
  description: "Generates code based on the Web3APIs schema",
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, parameters, print } = toolbox;

    let {
      h, help,
      o, outputDir,
      l, language
    } = parameters.options;

    help = help || h;
    outputDir = outputDir || o;
    language = language || l;

    let manifestPath;
    try {
      [manifestPath] = fixParameters(toolbox.parameters, {
        h,
        help
      });
    } catch (e) {
      print.error(e.message);
      process.exitCode = 1;
      return;
    }

    if (help) {
      print.info(HELP);
      return;
    }

    if (outputDir === true) {
      print.error("--output-dir option missing <path> argument");
      print.info(HELP);
      return;
    }

    if (language === true) {
      print.error("--language option missing <language> argument");
      print.info(HELP);
      return;
    }

    manifestPath =
      (manifestPath && filesystem.resolve(manifestPath)) ||
      filesystem.resolve("web3api.yaml");
    outputDir =
      (outputDir && filesystem.resolve(outputDir)) ||
      filesystem.resolve("src/generated");
    language = language || undefined;

    const generator = new CodeGenerator({
      manifestPath,
      outputDir,
      language
    });

    const result = await generator.generate();
    if (result === false) {
      process.exitCode = 1;
      return;
    }

    process.exitCode = 0;
  }
}
