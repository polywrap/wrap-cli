import { Command, Program } from "./types";
import {
  CodeGenerator,
  Compiler,
  PolywrapProject,
  SchemaComposer,
  intlMsg,
  defaultPolywrapManifest,
  parseDirOption,
  parseCodegenScriptOption,
  parseWasmManifestFileOption,
  parseClientConfigOption,
} from "../lib";

import path from "path";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";

const defaultCodegenDir = "./wrap";
const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");

type CodegenCommandOptions = {
  manifestFile: string;
  codegenDir: string;
  script?: string;
  clientConfig: Partial<PolywrapClientConfig>;
};

export const codegen: Command = {
  setup: (program: Program) => {
    program
      .command("codegen")
      .alias("g")
      .description(intlMsg.commands_codegen_description())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_codegen_options_m({
          default: defaultManifestStr,
        })}`
      )
      .option(
        `-g, --codegen-dir <${pathStr}>`,
        ` ${intlMsg.commands_codegen_options_codegen({
          default: defaultCodegenDir,
        })}`
      )
      .option(
        `-s, --script <${pathStr}>`,
        `${intlMsg.commands_codegen_options_s()}`
      )
      .option(
        `-c, --client-config <${intlMsg.commands_common_options_configPath()}>`,
        `${intlMsg.commands_common_options_config()}`
      )
      .action(async (options) => {
        await run({
          ...options,
          clientConfig: await parseClientConfigOption(options.clientConfig),
          codegenDir: parseDirOption(options.codegenDir, defaultCodegenDir),
          script: parseCodegenScriptOption(options.script),
          manifestFile: parseWasmManifestFileOption(options.manifestFile),
        });
        process.exit();
      });
  },
};

async function run(options: CodegenCommandOptions) {
  const { manifestFile, codegenDir, script, clientConfig } = options;

  // Get Client
  const client = new PolywrapClient(clientConfig);

  // Polywrap Project
  const project = new PolywrapProject({
    rootDir: path.dirname(manifestFile),
    polywrapManifestPath: manifestFile,
  });
  await project.validate();
  const schemaComposer = new SchemaComposer({
    project,
    client,
  });

  let result = false;
  if (script) {
    const codeGenerator = new CodeGenerator({
      project,
      schemaComposer,
      customScript: script,
      codegenDirAbs: codegenDir,
    });

    result = await codeGenerator.generate();
  } else {
    const compiler = new Compiler({
      project,
      outputDir: __dirname + "/build",
      schemaComposer,
    });

    result = await compiler.codegen();
  }

  if (result) {
    console.log(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
