/* eslint-disable  @typescript-eslint/no-unused-vars */
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
  isPolywrapManifestLanguage,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  PluginProject,
  generateWrapFile,
  AppProject,
} from "../lib";

import path from "path";
import fs from "fs";
import { filesystem } from "gluegun";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import YAML from "js-yaml";

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

type ManifestTypeFields = {
  language: string | undefined;
  project: {
    type: string | undefined;
  };
};

// type polywrapManifestTypes = PolywrapManifestLanguage;

async function run(options: CodegenCommandOptions) {
  const { manifestFile, codegenDir, script, clientConfig } = options;

  // Get Client
  const client = new PolywrapClient(clientConfig);
  const manifestText = filesystem.read(manifestFile) as string;

  const projectType = detectManifestProjectType(manifestText);

  let result = false;

  switch (projectType) {
    case "wasm/interface":
      result = await runWasmOrInterfaceProjectCodegen(
        manifestFile,
        client,
        script,
        codegenDir
      );
      break;
    case "plugin":
      result = await runPluginProjectCodegen(manifestFile, client, codegenDir);
      break;
    case "app":
      result = await runAppProjectCodegen(manifestFile, client, codegenDir);
      break;
    default:
      console.log("Could not detect Polywrap project type!");
      result = false;
      break;
  }

  if (result) {
    console.log(`🔥 ${intlMsg.commands_codegen_success()} 🔥`);
    process.exitCode = 0;
  } else {
    process.exitCode = 1;
  }
}

function detectManifestProjectType(manifest: string): PolywrapProjectType {
  let anyPolywrapManifest: ManifestTypeFields | undefined = undefined;

  try {
    anyPolywrapManifest = JSON.parse(manifest) as ManifestTypeFields;
  } catch (e) {
    anyPolywrapManifest = YAML.safeLoad(manifest) as
      | ManifestTypeFields
      | undefined;
  }

  const type =
    anyPolywrapManifest?.language ?? anyPolywrapManifest?.project.type ?? "";

  if (isPolywrapManifestLanguage(type)) {
    return "wasm/interface";
  } else if (isPluginManifestLanguage(type)) {
    return "plugin";
  } else if (isAppManifestLanguage(type)) {
    return "app";
  } else {
    return undefined;
  }
}

type PolywrapProjectType = "wasm/interface" | "plugin" | "app" | undefined;

async function runWasmOrInterfaceProjectCodegen(
  manifestFile: string,
  client: PolywrapClient,
  script: string | undefined,
  codegenDir: string
): Promise<boolean> {
  let result = false;

  const project = new PolywrapProject({
    rootDir: path.dirname(manifestFile),
    polywrapManifestPath: manifestFile,
  });
  await project.validate();
  const schemaComposer = new SchemaComposer({
    project,
    client,
  });
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

  return result;
}

async function runPluginProjectCodegen(
  manifestFile: string,
  client: PolywrapClient,
  codegenDir: string
): Promise<boolean> {
  let result = false;

  // Plugin project
  const project = new PluginProject({
    rootDir: path.dirname(manifestFile),
    pluginManifestPath: manifestFile,
  });
  await project.validate();
  const manifest = await project.getManifest();
  const schemaComposer = new SchemaComposer({
    project,
    client,
  });

  const codeGenerator = new CodeGenerator({
    project,
    schemaComposer,
    codegenDirAbs: codegenDir,
  });

  result = await codeGenerator.generate();

  // Output the built manifest
  const manifestPath = path.join(codegenDir, "wrap.info");

  if (!fs.existsSync(codegenDir)) {
    fs.mkdirSync(codegenDir);
  }

  await generateWrapFile(
    await schemaComposer.getComposedAbis(),
    manifest.project.name,
    "plugin",
    manifestPath
  );

  return result;
}

async function runAppProjectCodegen(
  manifestFile: string,
  client: PolywrapClient,
  codegenDir: string
): Promise<boolean> {
  let result = false;
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

  result = await codeGenerator.generate();
  return result;
}
