import { Command, Program } from "./types";
import YAML from "js-yaml";
import fs from "fs";
import {
  deserializeAppManifest,
  deserializePluginManifest,
  deserializePolywrapManifest,
  latestAppManifestFormat,
  latestPluginManifestFormat,
  latestPolywrapManifestFormat,
  migrateAppManifest,
  migratePluginManifest,
  migratePolywrapManifest,
} from "@polywrap/polywrap-manifest-types-js";
import {
  getProjectManifestLanguage,
  intlMsg,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  isPolywrapManifestLanguage,
  parseManifestFileOption,
} from "../lib";
import { defaultManifestFiles } from "../lib/option-defaults";

const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultManifestFiles.join(" | ");

export const manifest: Command = {
  setup: (program: Program) => {
    const manifestCommand = program
      .command("manifest")
      .alias("m")
      .description("Manifest commands");

    manifestCommand
      .command("schema")
      .alias("s")
      .description("Prints out the schema for the current manifest format.")
      .action(async (options) => {
        await runSchemaCommand(options);
      });

    manifestCommand
      .command("migrate")
      .alias("m")
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultManifestStr,
        })}`
      )
      .description("Migrates the polywrap manifest to the latest version.")
      .action(async (options) => {
        console.log("options", options)
        await runMigrateCommand({
          ...options,
          manifestFile: parseManifestFileOption(options.manifestFile),
        });
      });
  },
};

type ManifestSchemaCommandOptions = {};
type ManifestMigrateCommandOptions = {
  manifestFile: string
};

const runSchemaCommand = async (_options: ManifestSchemaCommandOptions) => {
  console.log("foobar");
};

const runMigrateCommand = async (options: ManifestMigrateCommandOptions) => {
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  // Detect project manifest language
  const language = getProjectManifestLanguage(manifestString);

  if (!language) {
    console.log("Unsupported project language!");
    return;
  }

  let outputManifestString: string = "";

  if (isPolywrapManifestLanguage(language)) {
    console.log("detected wasm/interface");
    outputManifestString = performPolywrapProjectManifestMigration(manifestString);
  } else if (isAppManifestLanguage(language)) {
    console.log("detected app");
    outputManifestString = performAppProjectManifestMigration(manifestString);
  } else if (isPluginManifestLanguage(language)) {
    console.log("detected plugin");
    outputManifestString = performPluginProjectManifestMigration(manifestString);
  }
  
  fs.writeFileSync("polywrap-new.yaml", outputManifestString, {
    encoding: "utf-8",
  });
};

function performPolywrapProjectManifestMigration(manifest: string): string {
  const manifestObject = deserializePolywrapManifest(manifest);

  const newManifest = migratePolywrapManifest(
    manifestObject,
    latestPolywrapManifestFormat
  );

  // Clean manifest object
  const newManifestCleaned = JSON.parse(JSON.stringify(newManifest));
  delete newManifestCleaned.__type;

  // get YAML string
  return YAML.dump(newManifestCleaned);
}

function performAppProjectManifestMigration(manifest: string): string {
  const manifestObject = deserializeAppManifest(manifest);

  const newManifest = migrateAppManifest(
    manifestObject,
    latestAppManifestFormat
  );

  // Clean manifest object
  const newManifestCleaned = JSON.parse(JSON.stringify(newManifest));
  delete newManifestCleaned.__type;

  // get YAML string
  return YAML.dump(newManifestCleaned);
}

function performPluginProjectManifestMigration(manifest: string): string {
  const manifestObject = deserializePluginManifest(manifest);

  const newManifest = migratePluginManifest(
    manifestObject,
    latestPluginManifestFormat
  );

  // Clean manifest object
  const newManifestCleaned = JSON.parse(JSON.stringify(newManifest));
  delete newManifestCleaned.__type;

  // get YAML string
  return YAML.dump(newManifestCleaned);
}

/* DEV TODO
- define migration options
  - manifest type
    - project (auto-detect language)
    - build
    - deploy
    - meta
    - run?
  - save old manifest to ./polywrap/manifest/*.yaml
*/