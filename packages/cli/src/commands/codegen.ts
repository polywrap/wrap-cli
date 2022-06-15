import { Command, Program } from "./types";
import {
  CodeGenerator,
  Compiler,
  PolywrapProject,
  SchemaComposer,
  intlMsg,
  defaultPolywrapManifest,
  getTestEnvProviders,
  parseCodegenDirOption,
  parseCodegenScriptOption,
  parseWasmManifestFileOption,
} from "../lib";

import path from "path";
import { filesystem } from "gluegun";

const defaultCodegenDir = "./wrap";
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");

type CodegenCommandOptions = {
  manifestFile: string;
  codegenDir: string;
  script?: string;
  ipfs?: string;
  ens?: string;
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
        `-c, --codegen-dir <${pathStr}>`,
        ` ${intlMsg.commands_codegen_options_codegen({
          default: defaultCodegenDir,
        })}`
      )
      .option(
        `-s, --script <${pathStr}>`,
        `${intlMsg.commands_codegen_options_s()}`
      )
      .option(
        `-i, --ipfs [<${nodeStr}>]`,
        `${intlMsg.commands_codegen_options_i()}`
      )
      .option(
        `-e, --ens [<${addrStr}>]`,
        `${intlMsg.commands_codegen_options_e()}`
      )
      .action(async (options) => {
        await run({
          ...options,
          codegenDir: parseCodegenDirOption(options.codegenDir, undefined),
          script: parseCodegenScriptOption(options.script, undefined),
          manifestFile: parseWasmManifestFileOption(
            options.manifestFile,
            undefined
          ),
        });
      });
  },
};

async function run(options: CodegenCommandOptions) {
  const { ipfs, ens, manifestFile, codegenDir, script } = options;
  const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
  const ensAddress: string | undefined = ens;

  // Polywrap Project
  const project = new PolywrapProject({
    rootDir: path.dirname(manifestFile),
    polywrapManifestPath: manifestFile,
  });
  await project.validate();
  const schemaComposer = new SchemaComposer({
    project,
    ipfsProvider,
    ethProvider,
    ensAddress,
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
      outputDir: filesystem.path("build"),
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
