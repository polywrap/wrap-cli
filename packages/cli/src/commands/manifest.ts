import { Argument, Command, Program, BaseCommandOptions } from "./types";
import { createLogger } from "./utils/createLogger";
import {
  defaultBuildManifest,
  defaultDeployManifest,
  defaultInfraManifest,
  defaultWorkflowManifest,
  getProjectManifestLanguage,
  intlMsg,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  isPolywrapManifestLanguage,
  maybeGetManifestFormatVersion,
  parseManifestFileOption,
  CacheDirectory,
  defaultPolywrapManifest,
  Logger,
  parseLogFileOption,
} from "../lib";
import {
  getYamlishSchemaForManifestJsonSchemaObject,
  migrateAppProjectManifest,
  migrateBuildExtensionManifest,
  migrateDeployExtensionManifest,
  migrateInfraExtensionManifest,
  migratePluginProjectManifest,
  migratePolywrapProjectManifest,
  migrateWorkflow,
} from "../lib/manifest";
import { defaultProjectManifestFiles } from "../lib/option-defaults";

import { JSONSchema4 } from "json-schema";
import {
  AppManifestFormats,
  AppManifestSchemaFiles,
  BuildManifestFormats,
  BuildManifestSchemaFiles,
  DeployManifestFormats,
  DeployManifestSchemaFiles,
  InfraManifestFormats,
  InfraManifestSchemaFiles,
  PluginManifestFormats,
  PluginManifestSchemaFiles,
  PolywrapManifestFormats,
  PolywrapManifestSchemaFiles,
  PolywrapWorkflowFormats,
  PolywrapWorkflowSchemaFiles,
  latestAppManifestFormat,
  latestBuildManifestFormat,
  latestDeployManifestFormat,
  latestInfraManifestFormat,
  latestPluginManifestFormat,
  latestPolywrapManifestFormat,
  latestPolywrapWorkflowFormat,
} from "@polywrap/polywrap-manifest-types-js";
import { dereference } from "@apidevtools/json-schema-ref-parser";
// Workaround: https://github.com/APIDevTools/json-schema-ref-parser/issues/139#issuecomment-940500698
import $RefParser from "@apidevtools/json-schema-ref-parser";
$RefParser.dereference = $RefParser.dereference.bind($RefParser);
import fs from "fs";
import path from "path";

const pathStr = intlMsg.commands_manifest_options_m_path();
const formatStr = intlMsg.commands_manifest_options_m_format();

const defaultProjectManifestStr = defaultPolywrapManifest.join(" | ");

const manifestTypes = [
  "project",
  "build",
  "deploy",
  "infra",
  "workflow",
] as const;
export type ManifestType = typeof manifestTypes[number];

export interface ManifestSchemaCommandOptions extends BaseCommandOptions {
  raw: boolean;
  manifestFile: string | false;
}

export interface ManifestMigrateCommandOptions extends BaseCommandOptions {
  manifestFile: string | false;
  format: string | false;
}

export const manifest: Command = {
  setup: (program: Program) => {
    const manifestCommand = program
      .command("manifest")
      .alias("m")
      .description(intlMsg.commands_manifest_description());

    manifestCommand
      .command("schema")
      .alias("s")
      .description(intlMsg.commands_manifest_command_s())
      .addArgument(
        new Argument(
          "type",
          intlMsg.commands_manifest_options_t({ default: manifestTypes[0] })
        )
          .argOptional()
          .choices(manifestTypes)
          .default(manifestTypes[0])
      )
      .option(`-r, --raw`, intlMsg.commands_manifest_command_s_option_r())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultProjectManifestStr,
        })}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (type, options: Partial<ManifestSchemaCommandOptions>) => {
        await runSchemaCommand(type, {
          raw: options.raw || false,
          manifestFile: options.manifestFile || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
        });
      });

    manifestCommand
      .command("migrate")
      .alias("m")
      .description(intlMsg.commands_manifest_command_m())
      .addArgument(
        new Argument(
          "type",
          intlMsg.commands_manifest_options_t({ default: manifestTypes[0] })
        )
          .argOptional()
          .choices(manifestTypes)
          .default(manifestTypes[0])
      )
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_manifest_options_m({
          default: defaultProjectManifestStr,
        })}`
      )
      .option(
        `-f, --format <${formatStr}>`,
        `${intlMsg.commands_manifest_options_f()}`
      )
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .action(async (type, options: Partial<ManifestMigrateCommandOptions>) => {
        await runMigrateCommand(type, {
          manifestFile: options.manifestFile || false,
          format: options.format || false,
          verbose: options.verbose || false,
          quiet: options.quiet || false,
          logFile: parseLogFileOption(options.logFile),
        });
      });
  },
};

export const runSchemaCommand = async (
  type: ManifestType,
  options: Required<ManifestSchemaCommandOptions>
): Promise<void> => {
  const { verbose, quiet, logFile } = options;
  const logger = createLogger({ verbose, quiet, logFile });
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

  const schemasPackageDir = path.dirname(
    require.resolve("@polywrap/polywrap-manifest-schemas")
  );

  let manifestSchemaFile = "";
  let language: string | undefined;

  switch (type) {
    case "project":
      language = getProjectManifestLanguage(manifestString);

      if (!language) {
        throw new Error("Unsupported project type!");
      }

      if (isPolywrapManifestLanguage(language)) {
        maybeFailOnUnsupportedManifestFormat(
          manifestVersion,
          Object.values(PolywrapManifestFormats),
          manifestfile,
          logger
        );

        manifestSchemaFile = path.join(
          schemasPackageDir,
          PolywrapManifestSchemaFiles[
            manifestVersion ?? latestPolywrapManifestFormat
          ]
        );
      } else if (isAppManifestLanguage(language)) {
        maybeFailOnUnsupportedManifestFormat(
          manifestVersion,
          Object.values(AppManifestFormats),
          manifestfile,
          logger
        );

        manifestSchemaFile = path.join(
          schemasPackageDir,
          AppManifestSchemaFiles[manifestVersion ?? latestAppManifestFormat]
        );
      } else if (isPluginManifestLanguage(language)) {
        maybeFailOnUnsupportedManifestFormat(
          manifestVersion,
          Object.values(PluginManifestFormats),
          manifestfile,
          logger
        );

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
      maybeFailOnUnsupportedManifestFormat(
        manifestVersion,
        Object.values(BuildManifestFormats),
        manifestfile,
        logger
      );

      manifestSchemaFile = path.join(
        schemasPackageDir,
        BuildManifestSchemaFiles[manifestVersion ?? latestBuildManifestFormat]
      );
      break;

    case "deploy":
      maybeFailOnUnsupportedManifestFormat(
        manifestVersion,
        Object.values(DeployManifestFormats),
        manifestfile,
        logger
      );

      manifestSchemaFile = path.join(
        schemasPackageDir,
        DeployManifestSchemaFiles[manifestVersion ?? latestDeployManifestFormat]
      );
      break;

    case "infra":
      maybeFailOnUnsupportedManifestFormat(
        manifestVersion,
        Object.values(InfraManifestFormats),
        manifestfile,
        logger
      );

      manifestSchemaFile = path.join(
        schemasPackageDir,
        InfraManifestSchemaFiles[manifestVersion ?? latestInfraManifestFormat]
      );
      break;

    case "workflow":
      maybeFailOnUnsupportedManifestFormat(
        manifestVersion,
        Object.values(PolywrapWorkflowFormats),
        manifestfile,
        logger
      );

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
    logger.info(schemaString);
  } else {
    const schema = await dereference(JSON.parse(schemaString));

    logger.info(
      getYamlishSchemaForManifestJsonSchemaObject(
        schema.properties as JSONSchema4
      )
    );
  }
};

const runMigrateCommand = async (
  type: ManifestType,
  options: Required<ManifestMigrateCommandOptions>
) => {
  const { verbose, quiet, logFile } = options;
  const logger = createLogger({ verbose, quiet, logFile });
  let manifestFile = "";
  let manifestString: string;
  let language: string | undefined;

  switch (type) {
    case "project":
      manifestFile = parseManifestFileOption(
        options.manifestFile,
        defaultProjectManifestFiles
      );

      manifestString = fs.readFileSync(manifestFile, {
        encoding: "utf-8",
      });

      language = getProjectManifestLanguage(manifestString);

      if (!language) {
        logger.info(intlMsg.commands_manifest_projectTypeError());
        process.exit(1);
      }

      if (isPolywrapManifestLanguage(language)) {
        maybeFailOnUnsupportedTargetFormat(
          options.format,
          Object.values(PolywrapManifestFormats),
          logger
        );
        return migrateManifestFile(
          manifestFile,
          migratePolywrapProjectManifest,
          options.format || latestPolywrapManifestFormat,
          logger
        );
      } else if (isAppManifestLanguage(language)) {
        maybeFailOnUnsupportedTargetFormat(
          options.format,
          Object.values(AppManifestFormats),
          logger
        );
        return migrateManifestFile(
          manifestFile,
          migrateAppProjectManifest,
          options.format || latestAppManifestFormat,
          logger
        );
      } else if (isPluginManifestLanguage(language)) {
        maybeFailOnUnsupportedTargetFormat(
          options.format,
          Object.values(PluginManifestFormats),
          logger
        );
        return migrateManifestFile(
          manifestFile,
          migratePluginProjectManifest,
          options.format || latestPluginManifestFormat,
          logger
        );
      }

      logger.info(intlMsg.commands_manifest_projectTypeError());
      process.exit(1);
      break;

    case "build":
      maybeFailOnUnsupportedTargetFormat(
        options.format,
        Object.values(BuildManifestFormats),
        logger
      );
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultBuildManifest),
        migrateBuildExtensionManifest,
        options.format || latestBuildManifestFormat,
        logger
      );
      break;

    case "deploy":
      maybeFailOnUnsupportedTargetFormat(
        options.format,
        Object.values(DeployManifestFormats),
        logger
      );
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultDeployManifest),
        migrateDeployExtensionManifest,
        options.format || latestDeployManifestFormat,
        logger
      );
      break;

    case "infra":
      maybeFailOnUnsupportedTargetFormat(
        options.format,
        Object.values(InfraManifestFormats),
        logger
      );
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultInfraManifest),
        migrateInfraExtensionManifest,
        options.format || latestInfraManifestFormat,
        logger
      );
      break;

    case "workflow":
      maybeFailOnUnsupportedTargetFormat(
        options.format,
        Object.values(PolywrapWorkflowFormats),
        logger
      );
      migrateManifestFile(
        parseManifestFileOption(options.manifestFile, defaultWorkflowManifest),
        migrateWorkflow,
        options.format || latestPolywrapWorkflowFormat,
        logger
      );
      break;
  }
};

function migrateManifestFile(
  manifestFile: string,
  migrationFn: (input: string, to: string, logger?: Logger) => string,
  to: string,
  logger: Logger
): void {
  const manifestFileName = path.basename(manifestFile);
  const manifestFileDir = path.dirname(manifestFile);

  logger.info(
    intlMsg.commands_manifest_command_m_migrateManifestMessage({
      manifestFile: manifestFileName,
      version: to,
    })
  );

  const manifestString = fs.readFileSync(manifestFile, {
    encoding: "utf-8",
  });

  const outputManifestString = migrationFn(manifestString, to, logger);

  // Cache the old manifest file
  const cache = new CacheDirectory({
    rootDir: manifestFileDir,
    subDir: "manifest",
  });
  cache.writeCacheFile(
    manifestFileName,
    fs.readFileSync(manifestFile, "utf-8")
  );

  logger.info(
    intlMsg.commands_manifest_command_m_preserveManifestMessage({
      preservedFilePath: path.relative(
        manifestFileDir,
        cache.getCachePath(manifestFileName)
      ),
    })
  );

  fs.writeFileSync(manifestFile, outputManifestString, {
    encoding: "utf-8",
  });
}

function maybeFailOnUnsupportedManifestFormat(
  format: string | undefined,
  formats: string[],
  manifestFile: string,
  logger: Logger
) {
  if (!format) {
    return;
  }

  if (!formats.includes(format)) {
    logger.error(
      intlMsg.commands_manifest_formatError({
        fileName: path.relative(".", manifestFile),
        values: formats.join(", "),
      })
    );
    process.exit(1);
  }
}

function maybeFailOnUnsupportedTargetFormat(
  format: string | undefined | false,
  formats: string[],
  logger: Logger
) {
  if (!format) {
    return;
  }

  if (!formats.includes(format)) {
    logger.error(
      intlMsg.commands_manifest_migrate_targetFormatError({
        formats: formats.join(", "),
      })
    );
    process.exit(1);
  }
}
