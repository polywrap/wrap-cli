import { Command, Program } from "./types";
import {
  AppProject,
  CodeGenerator,
  SchemaComposer,
  intlMsg,
  getSimpleClient,
  getTestEnvProviders,
  parseAppManifestFileOption,
  parseAppCodegenDirOption,
} from "../lib";

import { PolywrapClient } from "@polywrap/client-js";
import * as path from "path";

const defaultOutputTypesDir = "./src/wrap";

type AppCommandOptions = {
  manifestFile: string;
  codegenDir: string;
  ipfs?: string;
  ens?: string;
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
        `-c, --codegen-dir <${intlMsg.commands_codegen_options_o_path()}>`,
        `${intlMsg.commands_app_options_codegen({
          default: defaultOutputTypesDir,
        })}`
      )
      .option(
        `-i, --ipfs [<${intlMsg.commands_codegen_options_i_node()}>] `,
        `${intlMsg.commands_codegen_options_i()}`
      )
      .option(
        `-e, --ens [<${intlMsg.commands_codegen_options_e_address()}>]`,
        `${intlMsg.commands_codegen_options_e()}`
      )
      .action(async (options) => {
        await run({
          ...options,
          manifestFile: parseAppManifestFileOption(
            options.manifestFile,
            undefined
          ),
          codegenDir: parseAppCodegenDirOption(options.codegenDir, undefined),
        });
      });
  },
};

async function run(options: AppCommandOptions) {
  const { manifestFile, codegenDir, ipfs, ens } = options;

  // Get providers and client
  const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
  const ensAddress: string | undefined = ens;
  const client: PolywrapClient = getSimpleClient({
    ensAddress,
    ethProvider,
    ipfsProvider,
  });

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
