import { Command, Program, Argument } from "./types";
import fs from "fs";
import path from "path";
import {
  latestBuildManifestFormat,
  latestDeployManifestFormat,
  latestInfraManifestFormat,
  latestMetaManifestFormat,
  latestPolywrapManifestFormat,
  latestPolywrapWorkflowFormat,
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
import { migrateInfraExtensionManifest } from "../lib/manifest/migrateInfraExtensionManifest";
import { migrateWorkflow } from "../lib/manifest/migrateTestExtensionManifest";

const pathStr = intlMsg.commands_manifest_options_m_path();

const defaultProjectManifestStr = defaultProjectManifestFiles.join(" | ");

const manifestFileTypes = [
  "project",
  "build",
  "deploy",
  "infra",
  "meta",
  "workflow",
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
      .addArgument(
        new Argument("type", "Manifest file type.")
          .argOptional()
          .choices(manifestFileTypes)
          .default(manifestFileTypes[0])
      )
      .option(`-r, --raw`, `Output raw JSON Schema`, false)
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultProjectManifestStr,
        })}`
      )
      .action(async (type, options) => {
        await runSchemaCommand({
          type,
          options,
        });
      });

    manifestCommand
      .command("migrate")
      .alias("m")
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
        await runMigrateCommand(type, options);
      });
  },
};

export const runSchemaCommand = async (
  type: string,
  options: ManifestSchemaCommandOptions
) => {
  // get format version
  // if project do project type detection
  // if can get, render for version. Otherwise render latest

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
    const manifestfile = parseManifestFileOption(
      options.manifestFile,
      defaultProjectManifestFiles
    );

    const manifestString = fs.readFileSync(manifestfile, {
      encoding: "utf-8",
    });

    const language = getProjectManifestLanguage(manifestString);

    if (!language) {
      throw new Error("Unsupported project type!");
    }

    if (isPolywrapManifestLanguage(language)) {
      return runManifestFileMigration(
        manifestfile,
        migratePolywrapProjectManifest,
        latestPolywrapManifestFormat
      );
    } else if (isAppManifestLanguage(language)) {
      return runManifestFileMigration(
        manifestfile,
        migrateAppProjectManifest,
        latestPolywrapManifestFormat
      );
    } else if (isPluginManifestLanguage(language)) {
      return runManifestFileMigration(
        manifestfile,
        migratePluginProjectManifest,
        latestPolywrapManifestFormat
      );
    } else {
      throw new Error("Unsupported project type!");
    }
  } else if (type === "build") {
    runManifestFileMigration(
      parseManifestFileOption(options.manifestFile, defaultBuildManifest),
      migrateBuildExtensionManifest,
      latestBuildManifestFormat
    );
  } else if (type === "meta") {
    runManifestFileMigration(
      parseManifestFileOption(options.manifestFile, defaultMetaManifest),
      migrateMetaExtensionManifest,
      latestMetaManifestFormat
    );
  } else if (type === "deploy") {
    runManifestFileMigration(
      parseManifestFileOption(options.manifestFile, defaultDeployManifest),
      migrateDeployExtensionManifest,
      latestDeployManifestFormat
    );
  } else if (type === "infra") {
    runManifestFileMigration(
      options.manifestFile,
      migrateInfraExtensionManifest,
      latestInfraManifestFormat
    );
  } else if (type === "workflow") {
    runManifestFileMigration(
      options.manifestFile,
      migrateWorkflow,
      latestPolywrapWorkflowFormat
    );
  }
};

function runManifestFileMigration(
  manifestFile: string,
  migrationFn: (input: string) => string,
  version: string
): void {
  console.log(`Migrating ${path.basename(manifestFile)} to version ${version}`);

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

/* DEV TODO:
  - polywrap.test.yaml is on version 0.1 instad of 0.1.0 by default
  - pretty-print everything
  - add intlmsgs
  - remove `temp` test file
  - create tests
*/

function getManifestFormatVersion(manifest: string): string {

}
