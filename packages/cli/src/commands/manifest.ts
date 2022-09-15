import { Command, Program, Argument } from "./types";
import fs from "fs";
import path from "path";
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
  defaultInfraManifest,
  maybeGetManifestFormatVersion,
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
] as const;
type ManifestType = typeof manifestFileTypes[number];

type ManifestSchemaCommandOptions = {
  raw: boolean;
  manifestFile: ManifestType;
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
      .description(intlMsg.commands_manifest_command_s())
      .addArgument(
        new Argument(
          "type",
          intlMsg.commands_manifest_options_t({ default: manifestFileTypes[0] })
        )
          .argOptional()
          .choices(manifestFileTypes)
          .default(manifestFileTypes[0])
      )
      .option(
        `-r, --raw`,
        intlMsg.commands_manifest_command_s_option_r(),
        false
      )
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
      .description(intlMsg.commands_manifest_command_m())
      .addArgument(
        new Argument(
          "type",
          intlMsg.commands_manifest_options_t({ default: manifestFileTypes[0] })
        )
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
  type: ManifestType,
  options: ManifestSchemaCommandOptions
) => {
  let manifestfile = "";

  switch (type) {
    case "project":
      manifestfile = parseManifestFileOption(
        options.manifestFile,
        defaultProjectManifestFiles
      );
      break;

    case "build":
      manifestfile = parseManifestFileOption(
        options.manifestFile,
        defaultBuildManifest
      );
      break;

    case "meta":
      manifestfile = parseManifestFileOption(
        options.manifestFile,
        defaultMetaManifest
      );
      break;

    case "deploy":
      manifestfile = parseManifestFileOption(
        options.manifestFile,
        defaultDeployManifest
      );
      break;

    case "infra":
      manifestfile = parseManifestFileOption(
        options.manifestFile,
        defaultInfraManifest
      );
      break;

    case "workflow":
      manifestfile = parseManifestFileOption(
        options.manifestFile,
        defaultWorkflowManifest
      );
      break;
  }

  const manifestString = fs.readFileSync(manifestfile, {
    encoding: "utf-8",
  });

  const manifestVersion = maybeGetManifestFormatVersion(manifestString);

  if (!manifestVersion) {
    console.log(intlMsg.commands_manifest_formatError());
    process.exit(1);
  }

  const schemasPackageDir = path.dirname(
    require.resolve("@polywrap/polywrap-manifest-schemas")
  );

  let manifestSchemaFile = "";

  switch (type) {
    case "project":
      const language = getProjectManifestLanguage(manifestString);

      if (!language) {
        throw new Error("Unsupported project type!");
      }

      if (isPolywrapManifestLanguage(language)) {
        manifestSchemaFile = path.join(
          schemasPackageDir,
          PolywrapManifestSchemaFiles[
            manifestVersion ?? latestPolywrapManifestFormat
          ]
        );
      } else if (isAppManifestLanguage(language)) {
        manifestSchemaFile = path.join(
          schemasPackageDir,
          AppManifestSchemaFiles[manifestVersion ?? latestAppManifestFormat]
        );
      } else if (isPluginManifestLanguage(language)) {
        manifestSchemaFile = path.join(
          schemasPackageDir,
          PluginManifestSchemaFiles[
            manifestVersion ?? latestPluginManifestFormat
          ]
        );
      } else {
        throw new Error("Unsupported project type!");
      }
      break;

    case "build":
      manifestSchemaFile = path.join(
        schemasPackageDir,
        BuildManifestSchemaFiles[manifestVersion ?? latestBuildManifestFormat]
      );
      break;

    case "meta":
      manifestSchemaFile = path.join(
        schemasPackageDir,
        MetaManifestSchemaFiles[manifestVersion ?? latestMetaManifestFormat]
      );
      break;

    case "deploy":
      manifestSchemaFile = path.join(
        schemasPackageDir,
        DeployManifestSchemaFiles[manifestVersion ?? latestDeployManifestFormat]
      );
      break;

    case "infra":
      manifestSchemaFile = path.join(
        schemasPackageDir,
        InfraManifestSchemaFiles[manifestVersion ?? latestInfraManifestFormat]
      );
      break;

    case "workflow":
      manifestSchemaFile = path.join(
        schemasPackageDir,
        PolywrapWorkflowSchemaFiles[
          manifestVersion ?? latestPolywrapWorkflowFormat
        ]
      );
      break;
  }

  const schemaString = fs.readFileSync(manifestSchemaFile, {
    encoding: "utf-8",
  });

  if (options.raw) {
    console.log(schemaString);
  } else {
    const schema = await dereference(JSON.parse(schemaString));

    console.log(getYamlishSchemaForManifestJsonSchemaObject(schema.properties));
  }
};

const runMigrateCommand = async (
  type: ManifestType,
  options: ManifestMigrateCommandOptions
) => {
  switch (type) {
    case "project":
      const manifestfile = parseManifestFileOption(
        options.manifestFile,
        defaultProjectManifestFiles
      );

      const manifestString = fs.readFileSync(manifestfile, {
        encoding: "utf-8",
      });

      const language = getProjectManifestLanguage(manifestString);

      if (!language) {
        console.log(intlMsg.commands_manifest_projectTypeError());
        process.exit(1);
      }

      if (isPolywrapManifestLanguage(language)) {
        return migrateManifestFile(
          manifestfile,
          migratePolywrapProjectManifest,
          latestPolywrapManifestFormat
        );
      } else if (isAppManifestLanguage(language)) {
        return migrateManifestFile(
          manifestfile,
          migrateAppProjectManifest,
          latestPolywrapManifestFormat
        );
      } else if (isPluginManifestLanguage(language)) {
        return migrateManifestFile(
          manifestfile,
          migratePluginProjectManifest,
          latestPolywrapManifestFormat
        );
      } else {
        console.log(intlMsg.commands_manifest_projectTypeError());
        process.exit(1);
      }

    case "build":
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultBuildManifest),
        migrateBuildExtensionManifest,
        latestBuildManifestFormat
      );
      break;

    case "meta":
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultMetaManifest),
        migrateMetaExtensionManifest,
        latestMetaManifestFormat
      );
      break;

    case "deploy":
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultDeployManifest),
        migrateDeployExtensionManifest,
        latestDeployManifestFormat
      );
      break;

    case "infra":
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultInfraManifest),
        migrateInfraExtensionManifest,
        latestInfraManifestFormat
      );
      break;

    case "workflow":
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultWorkflowManifest),
        migrateWorkflow,
        latestPolywrapWorkflowFormat
      );
      break;
  }
};

function migrateManifestFile(
  manifestFile: string,
  migrationFn: (input: string) => string,
  version: string
): void {
  console.log(
    intlMsg.commands_manifest_command_m_migrateManifestMessage({
      manifestFile: path.basename(manifestFile),
      version: version,
    })
  );

  const manifestString = fs.readFileSync(manifestFile, {
    encoding: "utf-8",
  });

  const outputManifestString = migrationFn(manifestString);

  const oldManifestPath = preserveOldManifest(manifestFile);

  console.log(
    intlMsg.commands_manifest_command_m_preserveManifestMessage({
      preservedFilePath: oldManifestPath,
    })
  );

  fs.writeFileSync(manifestFile, outputManifestString, {
    encoding: "utf-8",
  });
}
