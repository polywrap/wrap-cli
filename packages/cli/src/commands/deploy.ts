/* eslint-disable prefer-const */
import { Command, Program, BaseCommandOptions } from "./types";
import { createLogger } from "./utils/createLogger";
import {
  intlMsg,
  parseManifestFileOption,
  parseLogFileOption,
  Deployer,
  defaultDeployManifest,
} from "../lib";

import fs from "fs";
import path from "path";
import yaml from "yaml";

const defaultManifestStr = defaultDeployManifest.join(" | ");
const pathStr = intlMsg.commands_deploy_options_o_path();

export interface DeployCommandOptions extends BaseCommandOptions {
  manifestFile: string;
  outputFile: string | false;
}

export const deploy: Command = {
  setup: (program: Program) => {
    program
      .command("deploy")
      .alias("d")
      .description(intlMsg.commands_deploy_description())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_deploy_options_m({
          default: defaultManifestStr,
        })}`
      )
      .option(
        `-o, --output-file <${pathStr}>`,
        `${intlMsg.commands_deploy_options_o()}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (options: Partial<DeployCommandOptions>) => {
        await run({
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultDeployManifest
          ),
          outputFile: options.outputFile || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
        });
      });
  },
};

async function run(options: Required<DeployCommandOptions>): Promise<void> {
  const { manifestFile, outputFile, verbose, quiet, logFile } = options;
  const logger = createLogger({ verbose, quiet, logFile });

  const deployer = await Deployer.create(manifestFile, logger);
  const jobResults = await deployer.run();

  if (outputFile) {
    const outputFileExt = path.extname(outputFile).substring(1);
    if (!outputFileExt) throw new Error("Require output file extension");
    switch (outputFileExt) {
      case "yaml":
      case "yml":
        fs.writeFileSync(outputFile, yaml.stringify(jobResults, null, 2));
        break;
      case "json":
        fs.writeFileSync(outputFile, JSON.stringify(jobResults, null, 2));
        break;
      default:
        throw new Error(
          intlMsg.commands_test_error_unsupportedOutputFileExt({
            outputFileExt,
          })
        );
    }
  }
  process.exit(0);
}
