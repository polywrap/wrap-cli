import { Command, Program } from "./types";
import {
  CodeGenerator,
  Compiler,
  Web3ApiProject,
  SchemaComposer,
  intlMsg,
  defaultWeb3ApiManifest,
  getTestEnvProviders,
  resolvePathIfExists,
} from "../lib";

import path from "path";
import { filesystem } from "gluegun";

const defaultCodegenDir = "./w3";
const nodeStr = intlMsg.commands_codegen_options_i_node();
const pathStr = intlMsg.commands_codegen_options_o_path();
const addrStr = intlMsg.commands_codegen_options_e_address();
const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");


export const codegen: Command = {
  setup: (program: Program) => {
    program
      .command("codegen")
      .alias("g")
      .description(intlMsg.commands_codegen_description())
      .option(`-m, --manifest-file <${pathStr}>`, `${intlMsg.commands_codegen_options_m(
        {
          default: defaultManifestStr,
        }
      )}`)
      .option(`-c, --codegen-dir <${pathStr}>`, ` ${intlMsg.commands_codegen_options_codegen(
        {
          default: defaultCodegenDir,
        }
      )}`)
      .option(`-s, --script <${pathStr}>`, `${intlMsg.commands_codegen_options_s()}`)
      .option(`-i, --ipfs [<${nodeStr}>]`, `${intlMsg.commands_codegen_options_i()}`)
      .option(`-e, --ens [<${addrStr}>]`, `${intlMsg.commands_codegen_options_e()}`)
      .action(async (options) => {
        await run(options);
      });
  }
}

async function run(options: any) {
  let {
    manifestFile,
    codegenDir,
    script,
    ipfs,
    ens,
  } = options;
  const { ipfsProvider, ethProvider } = await getTestEnvProviders(ipfs);
  const ensAddress: string | undefined = ens;
  manifestFile = resolvePathIfExists(
    filesystem,
    manifestFile ? [manifestFile] : defaultWeb3ApiManifest
  );

  codegenDir = codegenDir && filesystem.resolve(codegenDir);
  script = script && filesystem.resolve(script);

  // Web3Api Project
  const project = new Web3ApiProject({
    rootCacheDir: path.dirname(manifestFile),
    web3apiManifestPath: manifestFile,
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
      outputDir: codegenDir,
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