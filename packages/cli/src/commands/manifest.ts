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
  AnyProjectManifestLanguage,
  defaultPolywrapManifest,
  intlMsg,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  isPolywrapManifestLanguage,
} from "../lib";

const pathStr = intlMsg.commands_codegen_options_o_path();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");

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
        `${intlMsg.commands_codegen_options_m({
          default: defaultManifestStr,
        })}`
      )
      .description("Migrates the polywrap manifest to the latest version.")
      .action(async (options) => {
        console.log("options", options)
        await runMigrateCommand({
          ...options,
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

const runMigrateCommand = async (_options: ManifestMigrateCommandOptions) => {
  const manifestFilePath = "polywrap.yaml";

  const manifestString = fs.readFileSync(manifestFilePath, {
    encoding: "utf-8",
  });

  // Detect polywrap manifest language type
  const language = getProjectManifestLanguage(manifestString);

  if (!language) {
    console.log("Unsupported manifest language!");
    return;
  }

  let outputString: string = "";

  if (isPolywrapManifestLanguage(language)) {
    console.log("detected wasm/interface");
    outputString = performPolywrapProjectManifestMigration(manifestString);
  } else if (isAppManifestLanguage(language)) {
    console.log("detected app");
    outputString = performAppProjectManifestMigration(manifestString);
  } else if (isPluginManifestLanguage(language)) {
    console.log("detected plugin");
    outputString = performPluginProjectManifestMigration(manifestString);
  }

  fs.writeFileSync("polywrap-new.yaml", outputString, {
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
  - manifest path
  - manifest type
    - project (auto-detect language)
    - build
    - deploy
    - meta
    - run?
*/

// TODO: Remove most/all of this once https://github.com/polywrap/toolchain/pull/1051 is merged, as it's copied from there.

type ManifestProjectTypeProps = {
  // >= 0.2
  project?: {
    type: AnyProjectManifestLanguage;
  };
  // legacy
  language?: AnyProjectManifestLanguage;
};

function getProjectManifestLanguage(
  manifestStr: string
): AnyProjectManifestLanguage | undefined {
  let manifest: ManifestProjectTypeProps | undefined;

  try {
    manifest = JSON.parse(manifestStr) as ManifestProjectTypeProps;
  } catch (e) {
    manifest = YAML.safeLoad(manifestStr) as
      | ManifestProjectTypeProps
      | undefined;
  }
  console.log("project.type:", manifest?.project?.type);
  console.log("language:", manifest?.language);
  return manifest?.project?.type ?? manifest?.language;
}
