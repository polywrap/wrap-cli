import { Command, Program } from "./types";
import {
  AppProject,
  SchemaComposer,
  intlMsg,
  parseAppManifestFileOption,
  parseClientConfigOption,
  parseDirOption,
} from "../lib";
import { CodeGenerator } from "../lib/codegen/CodeGenerator";
import { DefaultCodegenStrategy } from "../lib/codegen/strategies/DefaultCodegenStrategy";

import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import * as path from "path";

const defaultOutputTypesDir = "./src/wrap";

type AppCommandOptions = {
  manifestFile: string;
  codegenDir: string;
  clientConfig: Partial<PolywrapClientConfig>;
};

export const app: Command = {
  setup: (program: Program) => {
    const appCommand = program
      .command("app")
      .alias("a")
      .description(intlMsg.commands_app_description());

    appCommand
      .command("codegen")
      .description(intlMsg.commands_app_codegen())
      .option(
        `-m, --manifest-file <${intlMsg.commands_codegen_options_o_path()}>`,
        intlMsg.commands_app_options_codegen({
          default: defaultOutputTypesDir,
        })
      )
      .option(
        `-g, --codegen-dir <${intlMsg.commands_codegen_options_o_path()}>`,
        `${intlMsg.commands_app_options_codegen({
          default: defaultOutputTypesDir,
        })}`
      )
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .action(async (options) => {
        await run({
          ...options,
          manifestFile: parseAppManifestFileOption(options.manifestFile),
          clientConfig: await parseClientConfigOption(options.clientConfig),
          codegenDir: parseDirOption(options.codegenDir, defaultOutputTypesDir),
        });
      });
  },
};

async function run(options: AppCommandOptions) {
  const { manifestFile, codegenDir, clientConfig } = options;

  // Get client
  const client = new PolywrapClient(clientConfig);

  // App project
  const project = new AppProject({
    rootDir: path.dirname(manifestFile),
    appManifestPath: manifestFile,
    client,
  });
  await project.validate();

  const schemaComposer = new SchemaComposer({
    project,
    client,
  });

  const codegenStrategy = new DefaultCodegenStrategy({
    project,
    schemaComposer,
    codegenDirAbs: codegenDir,
  });
  const codeGenerator = new CodeGenerator({ strategy: codegenStrategy });

  if (await codeGenerator.generate()) {
    console.log(`🔥 ${intlMsg.commands_app_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
