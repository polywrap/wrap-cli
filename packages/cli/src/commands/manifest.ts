import { Command, Program } from "./types";
import YAML from "js-yaml";
import fs from "fs";
import {
  deserializeAppManifest,
  deserializeBuildManifest,
  deserializeDeployManifest,
  deserializeMetaManifest,
  deserializePluginManifest,
  deserializePolywrapManifest,
  latestAppManifestFormat,
  latestBuildManifestFormat,
  latestDeployManifestFormat,
  latestMetaManifestFormat,
  latestPluginManifestFormat,
  latestPolywrapManifestFormat,
  migrateAppManifest,
  migrateBuildManifest,
  migrateDeployManifest,
  migrateMetaManifest,
  migratePluginManifest,
  migratePolywrapManifest,
} from "@polywrap/polywrap-manifest-types-js";
import {
  defaultBuildManifest,
  defaultDeployManifest,
  defaultMetaManifest,
  getProjectManifestLanguage,
  intlMsg,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  isPolywrapManifestLanguage,
  parseManifestFileOption,
} from "../lib";
import { defaultProjectManifestFiles } from "../lib/option-defaults";

const pathStr = intlMsg.commands_manifest_options_m_path();

const defaultProjectManifestStr = defaultProjectManifestFiles.join(" | ");
const defaultBuildManifestStr = defaultBuildManifest.join(" | ");
const defaultDeployManifestStr = defaultDeployManifest.join(" | ");
const defaultMetaManifestStr = defaultMetaManifest.join(" | ");

type ManifestSchemaCommandOptions = {};
type ManifestMigrateCommandOptions = {
  manifestFile: string;
};

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

    const migrateCommand = manifestCommand.command("migrate").alias("m");

    migrateCommand
      .description(
        "Migrates the polywrap project manifest to the latest version."
      )
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultProjectManifestStr,
        })}`
      )
      .action(async (options) => {
        await runMigrateCommand({
          ...options,
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultProjectManifestFiles
          ),
        });
      });

    migrateCommand
      .command("build")
      .alias("b")
      .description(
        "Migrates the polywrap build manifest to the latest version."
      )
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultBuildManifestStr,
        })}`
      )
      .action(async (options) => {
        await runMigrateBuildCommand({
          ...options,
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultBuildManifest
          ),
        });
      });

    migrateCommand
      .command("deploy")
      .alias("d")
      .description(
        "Migrates the polywrap deploy manifest to the latest version."
      )
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultDeployManifestStr,
        })}`
      )
      .action(async (options) => {
        await runMigrateDeployCommand({
          ...options,
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultDeployManifest
          ),
        });
      });

    migrateCommand
      .command("meta")
      .alias("m")
      .description("Migrates the polywrap meta manifest to the latest version.")
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultMetaManifestStr,
        })}`
      )
      .action(async (options) => {
        await runMigrateMetaCommand({
          ...options,
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultMetaManifest
          ),
        });
      });
  },
};

const runSchemaCommand = async (_options: ManifestSchemaCommandOptions) => {
  console.log("foobar");
};

const runMigrateCommand = async (options: ManifestMigrateCommandOptions) => {
  console.log("PROJECT");
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
    outputManifestString = performPolywrapProjectManifestMigration(
      manifestString
    );
  } else if (isAppManifestLanguage(language)) {
    console.log("detected app");
    outputManifestString = performAppProjectManifestMigration(manifestString);
  } else if (isPluginManifestLanguage(language)) {
    console.log("detected plugin");
    outputManifestString = performPluginProjectManifestMigration(
      manifestString
    );
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

const runMigrateBuildCommand = async (
  options: ManifestMigrateCommandOptions
) => {
  console.log("BUILD");
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  const manifestObject = deserializeBuildManifest(manifestString);

  const newManifest = migrateBuildManifest(
    manifestObject,
    latestBuildManifestFormat
  );

  const newManifestCleaned = JSON.parse(JSON.stringify(newManifest));
  delete newManifestCleaned.__type;

  const outputManifestString = YAML.dump(newManifestCleaned);

  fs.writeFileSync("polywrap.build-new.yaml", outputManifestString, {
    encoding: "utf-8",
  });
};

const runMigrateDeployCommand = async (
  options: ManifestMigrateCommandOptions
) => {
  console.log("DEPLOY");
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  const manifestObject = deserializeDeployManifest(manifestString);

  const newManifest = migrateDeployManifest(
    manifestObject,
    latestDeployManifestFormat
  );

  const newManifestCleaned = JSON.parse(JSON.stringify(newManifest));
  delete newManifestCleaned.__type;

  const outputManifestString = YAML.dump(newManifestCleaned);

  fs.writeFileSync("polywrap.deploy-new.yaml", outputManifestString, {
    encoding: "utf-8",
  });
};

const runMigrateMetaCommand = async (
  options: ManifestMigrateCommandOptions
) => {
  console.log("META");
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  const manifestObject = deserializeMetaManifest(manifestString);

  const newManifest = migrateMetaManifest(
    manifestObject,
    latestMetaManifestFormat
  );

  const newManifestCleaned = JSON.parse(JSON.stringify(newManifest));
  delete newManifestCleaned.__type;

  const outputManifestString = YAML.dump(newManifestCleaned);

  fs.writeFileSync("polywrap.meta-new.yaml", outputManifestString, {
    encoding: "utf-8",
  });
};