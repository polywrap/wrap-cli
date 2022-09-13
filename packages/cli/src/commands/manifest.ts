import { Command, Program, Argument } from "./types";
import fs from "fs";
import path from "path";
import {
  latestAppManifestFormat,
  latestBuildManifestFormat,
  latestDeployManifestFormat,
  latestMetaManifestFormat,
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
// const defaultBuildManifestStr = defaultBuildManifest.join(" | ");
// const defaultDeployManifestStr = defaultDeployManifest.join(" | ");
// const defaultMetaManifestStr = defaultMetaManifest.join(" | ");

const manifestFileTypes = [
  "project",
  "build",
  "deploy",
  // "infra",
  "meta",
  // "test",
];

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
      .addArgument(
        new Argument("type", "Manifest file type.")
          .argOptional()
          .choices(manifestFileTypes)
          .default(manifestFileTypes[0])
      )
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultProjectManifestStr,
        })}`
      )
      .action(async (type, options) => {
        await runMigrateCommand(type, {
          ...options,
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

const runMigrateCommand = async (
  type: string,
  options: ManifestMigrateCommandOptions
) => {
  if (type === "project") {
    runMigration(
      parseManifestFileOption(
        options.manifestFile,
        defaultProjectManifestFiles
      ),
      migrateProjectManifest
    );
  } else if (type === "build") {
    console.log(
      `Migrating build manifest file to version ${latestBuildManifestFormat}`
    );
    runMigration(
      parseManifestFileOption(options.manifestFile, defaultBuildManifest),
      migrateBuildExtensionManifest
    );
  } else if (type === "meta") {
    console.log(
      `Migrating meta manifest file to version ${latestMetaManifestFormat}`
    );
    runMigration(
      parseManifestFileOption(options.manifestFile, defaultMetaManifest),
      migrateMetaExtensionManifest
    );
  } else if (type === "deploy") {
    console.log(
      `Migrating deploy manifest file to version ${latestDeployManifestFormat}`
    );
    runMigration(
      parseManifestFileOption(options.manifestFile, defaultDeployManifest),
      migrateDeployExtensionManifest
    );
  }
};

function runMigration(
  manifestFile: string,
  migrationFn: (input: string) => string
): void {
  const manifestString = fs.readFileSync(manifestFile, {
    encoding: "utf-8",
  });

  const outputManifestString = migrationFn(manifestString);

  const oldManifestPath = preserveOldManifest(manifestFile);

  console.log(`Saved previous version of manifest to ${oldManifestPath}`);

  fs.writeFileSync(manifestFile, outputManifestString, {
    encoding: "utf-8",
  });
}

function migrateProjectManifest(manifestString: string): string {
  const language = getProjectManifestLanguage(manifestString);

  if (!language) {
    throw new Error("Unsupported project type!");
  }

  if (isPolywrapManifestLanguage(language)) {
    console.log(
      `Migrating wasm/interface project manifest file to version ${latestPolywrapManifestFormat}`
    );
    return migratePolywrapProjectManifest(manifestString);
  } else if (isAppManifestLanguage(language)) {
    console.log(
      `Migrating app project manifest file to version ${latestAppManifestFormat}`
    );
    return migrateAppProjectManifest(manifestString);
  } else if (isPluginManifestLanguage(language)) {
    console.log(
      `Migrating plugin project manifest file to version ${latestPluginManifestFormat}`
    );
    return migratePluginProjectManifest(manifestString);
  } else {
    throw new Error("Unsupported project type!");
  }
}

/* DEV TODO:
  - Determine project manifest type (wasm/interface, app, plugin) based on input file (with default input file)
  - Add support for extension manifests
    - build
    - deploy
    - infra
    - meta
    - test
  - pretty-print everything
  - add intlmsgs
  - remove `temp` test file
  - create tests

  build
  deploy
  infra
  meta
  test
*/
