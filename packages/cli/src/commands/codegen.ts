import { Command, Program } from "./types";
import {
  PolywrapProject,
  SchemaComposer,
  intlMsg,
  defaultPolywrapManifest,
  parseDirOption,
  parseCodegenScriptOption,
  parseWasmManifestFileOption,
  parseClientConfigOption,
} from "../lib";
import { ScriptCodegenStrategy } from "../lib/codegen/strategies/ScriptCodegenStrategy";
import { CodeGenerator } from "../lib/codegen/CodeGenerator";
import { CompilerCodegenStrategy } from "../lib/codegen";

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

  const strategy = script
    ? new ScriptCodegenStrategy({
        codegenDirAbs: codegenDir,
        script,
        schemaComposer,
        project,
        omitHeader: false,
        mustacheView: undefined,
      })
    : new CompilerCodegenStrategy({
        schemaComposer,
        project,
      });

  const codeGenerator = new CodeGenerator({ strategy });

  const result = await codeGenerator.generate();

  if (result) {
    console.log(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}
