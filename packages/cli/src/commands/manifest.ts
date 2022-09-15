import { Command, Program, Argument } from "./types";
import fs from "fs";
import path from "path";
import YAML from "js-yaml";
import {
  AppManifestSchemaFiles,
  BuildManifestSchemaFiles,
  DeployManifestSchemaFiles,
  InfraManifestSchemaFiles,
  latestAppManifestFormat,
  latestBuildManifestFormat,
  latestDeployManifestFormat,
  latestInfraManifestFormat,
  latestMetaManifestFormat,
  latestPluginManifestFormat,
  latestPolywrapManifestFormat,
  latestPolywrapWorkflowFormat,
  MetaManifestSchemaFiles,
  PluginManifestSchemaFiles,
  PolywrapWorkflowSchemaFiles,
} from "@polywrap/polywrap-manifest-types-js";
import {
  defaultBuildManifest,
  defaultDeployManifest,
  defaultMetaManifest,
  getProjectManifestLanguage,
  defaultWorkflowManifest,
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
  migrateInfraExtensionManifest,
  migrateWorkflow,
} from "../lib/manifest";
import { PolywrapManifestSchemaFiles } from "@polywrap/polywrap-manifest-types-js";

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
        await runSchemaCommand(type, options);
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
  let manifestfile = "";

  if (type === "project") {
    manifestfile = parseManifestFileOption(
      options.manifestFile,
      defaultProjectManifestFiles
    );
  } else if (type === "build") {
    manifestfile = parseManifestFileOption(
      options.manifestFile,
      defaultBuildManifest
    );
  } else if (type === "meta") {
    manifestfile = parseManifestFileOption(
      options.manifestFile,
      defaultMetaManifest
    );
  } else if (type === "deploy") {
    manifestfile = parseManifestFileOption(
      options.manifestFile,
      defaultDeployManifest
    );
  } else if (type === "infra") {
    manifestfile = parseManifestFileOption(options.manifestFile, []);
  } else if (type === "workflow") {
    manifestfile = parseManifestFileOption(
      options.manifestFile,
      defaultWorkflowManifest
    );
  }

  const manifestString = fs.readFileSync(manifestfile, {
    encoding: "utf-8",
  });

  const manifestVersion = getManifestFormatVersion(manifestString);
  
  const schemasPackageDir = path.dirname(
    require.resolve("@polywrap/polywrap-manifest-schemas")
  );

  if (type === "project") {
    const language = getProjectManifestLanguage(manifestString);

    if (!language) {
      throw new Error("Unsupported project type!");
    }

    if (isPolywrapManifestLanguage(language)) {
      const manifestSchemaFile = path.join(
        schemasPackageDir,
        PolywrapManifestSchemaFiles[
          manifestVersion ?? latestPolywrapManifestFormat
        ]
      );
      console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
    } else if (isAppManifestLanguage(language)) {
      const manifestSchemaFile = path.join(
        schemasPackageDir,
        AppManifestSchemaFiles[manifestVersion ?? latestAppManifestFormat]
      );
      console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
    } else if (isPluginManifestLanguage(language)) {
      const manifestSchemaFile = path.join(
        schemasPackageDir,
        PluginManifestSchemaFiles[manifestVersion ?? latestPluginManifestFormat]
      );
      console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
    }
  } else if (type === "build") {
    const manifestSchemaFile = path.join(
      schemasPackageDir,
      BuildManifestSchemaFiles[manifestVersion ?? latestBuildManifestFormat]
    );
    console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
  } else if (type === "meta") {
    const manifestSchemaFile = path.join(
      schemasPackageDir,
      MetaManifestSchemaFiles[manifestVersion ?? latestMetaManifestFormat]
    );
    console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
  } else if (type === "deploy") {
    const manifestSchemaFile = path.join(
      schemasPackageDir,
      DeployManifestSchemaFiles[manifestVersion ?? latestDeployManifestFormat]
    );
    console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
  } else if (type === "infra") {
    const manifestSchemaFile = path.join(
      schemasPackageDir,
      InfraManifestSchemaFiles[manifestVersion ?? latestInfraManifestFormat]
    );
    console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
  } else if (type === "workflow") {
    const manifestSchemaFile = path.join(
      schemasPackageDir,
      PolywrapWorkflowSchemaFiles[
        manifestVersion ?? latestPolywrapWorkflowFormat
      ]
    );
    console.log(await getSchemaAsString(manifestSchemaFile, options.raw));
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

function getManifestFormatVersion(manifestStr: string): string | undefined {
  type ManifestFormatProps = {
    format: string;
  };

  let manifest: ManifestFormatProps | undefined;

  try {
    manifest = JSON.parse(manifestStr) as ManifestFormatProps;
  } catch (e) {
    manifest = YAML.safeLoad(manifestStr) as ManifestFormatProps | undefined;
  }

  return manifest?.format;
}

async function getSchemaAsString(
  manifestSchemaFile: string,
  raw: boolean
): Promise<string> {
  const schemaString = fs.readFileSync(manifestSchemaFile, {
    encoding: "utf-8",
  });
  if (raw) {
    return schemaString;
  } else {
    const schema = await dereference(JSON.parse(schemaString));

    return getYamlishSchemaForManifestJsonSchemaObject(schema.properties);
  }
}
