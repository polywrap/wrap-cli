import { Command, Program } from "./types";
import fs from "fs";
import path from "path";
import {
  latestAppManifestFormat,
  latestPluginManifestFormat,
  latestPolywrapManifestFormat,
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
import { dereference } from "json-schema-ref-parser";
import {
  getYamlishSchemaForManifestJsonSchemaObject,
  migratePolywrapProjectManifest,
  migrateAppProjectManifest,
  migratePluginProjectManifest,
  migrateBuildExtensionManifest,
  migrateDeployExtensionManifest,
  migrateMetaExtensionManifest,
  preserveOldManifest,
} from "../lib/manifest";

const pathStr = intlMsg.commands_manifest_options_m_path();

const defaultProjectManifestStr = defaultProjectManifestFiles.join(" | ");
const defaultBuildManifestStr = defaultBuildManifest.join(" | ");
const defaultDeployManifestStr = defaultDeployManifest.join(" | ");
const defaultMetaManifestStr = defaultMetaManifest.join(" | ");

type ManifestSchemaCommandOptions = {
  raw: boolean;
  manifestFile: string;
};

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
      .option(`-r, --raw`, `Output raw JSON Schema`, false)
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultProjectManifestStr,
        })}`
      )
      .action(async (options) => {
        await runSchemaCommand({
          ...options,
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultProjectManifestFiles
          ),
        });
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

export const runSchemaCommand = async (
  options: ManifestSchemaCommandOptions
) => {
  // const manifestString = fs.readFileSync(options.manifestFile, {
  //   encoding: "utf-8",
  // });

  // const language = getProjectManifestLanguage(manifestString);

  // if(!language){
  //   console.log("Unsupported project type!");
  //   return;
  // }

  // let outputSchemaString: string = "";

  // if (isPolywrapManifestLanguage(language)) {
  //   const manifest = deserializePolywrapManifest(manifestString);
  //   const format = manifest.format;
  // } else if (isAppManifestLanguage(language)) {
  // } else if (isPluginManifestLanguage(language)) {
  // }

  const schemasPackageDir = path.dirname(
    require.resolve("@polywrap/polywrap-manifest-schemas")
  );
  const formatsDir = path.join(schemasPackageDir, "formats");
  const polywrapSchemaFile = path.join(formatsDir, "polywrap", "0.2.0.json");

  const schemaString = fs.readFileSync(polywrapSchemaFile, {
    encoding: "utf-8",
  });

  if (options.raw) {
    console.log(schemaString);
  } else {
    const schema = await dereference(JSON.parse(schemaString));

    console.log("# Polywrap project manifest schema 0.2.0");
    console.log();

    console.log(getYamlishSchemaForManifestJsonSchemaObject(schema.properties));
  }
};

const runMigrateCommand = async (options: ManifestMigrateCommandOptions) => {
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  const language = getProjectManifestLanguage(manifestString);

  if (!language) {
    console.log("Unsupported project type!");
    return;
  }

  let outputManifestString: string = "";

  if (isPolywrapManifestLanguage(language)) {
    console.log(
      `Migrating wasm/interface project manifest file to version ${latestPolywrapManifestFormat}`
    );
    outputManifestString = migratePolywrapProjectManifest(manifestString);
  } else if (isAppManifestLanguage(language)) {
    console.log(
      `Migrating app project manifest file to version ${latestAppManifestFormat}`
    );
    outputManifestString = migrateAppProjectManifest(manifestString);
  } else if (isPluginManifestLanguage(language)) {
    console.log(
      `Migrating plugin project manifest file to version ${latestPluginManifestFormat}`
    );
    outputManifestString = migratePluginProjectManifest(manifestString);
  }

  const oldManifestPath = preserveOldManifest(options.manifestFile);

  console.log(`Saved previous version of manifest to ${oldManifestPath}`);

  fs.writeFileSync(options.manifestFile, outputManifestString, {
    encoding: "utf-8",
  });
};

const runMigrateBuildCommand = async (
  options: ManifestMigrateCommandOptions
) => {
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  const outputManifestString = migrateBuildExtensionManifest(manifestString);

  const oldManifestPath = preserveOldManifest(options.manifestFile);

  console.log(`Saved previous version of manifest to ${oldManifestPath}`);

  fs.writeFileSync(options.manifestFile, outputManifestString, {
    encoding: "utf-8",
  });
};

const runMigrateDeployCommand = async (
  options: ManifestMigrateCommandOptions
) => {
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  const outputManifestString = migrateDeployExtensionManifest(manifestString);

  const oldManifestPath = preserveOldManifest(options.manifestFile);

  console.log(`Saved previous version of manifest to ${oldManifestPath}`);

  fs.writeFileSync(options.manifestFile, outputManifestString, {
    encoding: "utf-8",
  });
};

const runMigrateMetaCommand = async (
  options: ManifestMigrateCommandOptions
) => {
  const manifestString = fs.readFileSync(options.manifestFile, {
    encoding: "utf-8",
  });

  const outputManifestString = migrateMetaExtensionManifest(manifestString);

  const oldManifestPath = preserveOldManifest(options.manifestFile);

  console.log(`Saved previous version of manifest to ${oldManifestPath}`);

  fs.writeFileSync(options.manifestFile, outputManifestString, {
    encoding: "utf-8",
  });
};

/* DEV TODO:
  - Determine project manifest type (wasm/interface, app, plugin) based on input file (with default input file)
  - Add support for extension manifests
    - build
    - deploy
    - meta
  - pretty-print everything
  - add intlmsgs
  - remove `temp` test file
  - create tests
  - save old manifest to ./.polywrap/manifest/{manifestFile}.old

  build
  deploy
  infra
  meta
  test
*/
