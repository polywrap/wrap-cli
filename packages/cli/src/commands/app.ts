import { Command, Program } from "./types";
import {
  AppProject,
  CodeGenerator,
  SchemaComposer,
  intlMsg,
  parseAppManifestFileOption,
  parseAppCodegenDirOption,
  parseClientConfigOption,
} from "../lib";

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
          manifestFile: parseAppManifestFileOption(
            options.manifestFile,
            undefined
          ),
          clientConfig: await parseClientConfigOption(
            options.clientConfig,
            undefined
          ),
          codegenDir: parseAppCodegenDirOption(options.codegenDir, undefined),
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
  const codeGenerator = new CodeGenerator({
    project,
    schemaComposer,
    codegenDirAbs: codegenDir,
  });

  if (await codeGenerator.generate()) {
    console.log(`🔥 ${intlMsg.commands_app_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
