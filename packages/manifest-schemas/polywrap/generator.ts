import path from "path";
import fs, { Dirent } from "fs";
import * as os from "@polywrap/os-js";
import Mustache from "mustache";
import * as JsonSchema from "json-schema-to-typescript";

async function generateFormatTypes() {
  // Fetch all schemas within the @polywrap/polywrap-manifest-schemas/schemas/formats directory
  const formatsDir = path.join(__dirname, "formats/schemas");

  // Get all format types (wasm, build, infra, app, plugin, etc)
  const formatTypes = fs
    .readdirSync(formatsDir, { withFileTypes: true })
    .filter((dirent: Dirent) => dirent.isDirectory);

  // For each format type
  for (let i = 0; i < formatTypes.length; ++i) {
    const formatTypeName = formatTypes[i].name;
    const formatTypeDir = path.join(formatsDir, formatTypeName);
    const formatOutputDir = path.join(
      __dirname,
      `./formats/interfaces/${formatTypeName}`
    );
    const formatModules = [];

    // Get all JSON schemas for this format type (v1, v2, etc)
    const formatSchemaFiles = fs.readdirSync(formatTypeDir);
    const formatSchemas = [];

    for (let k = 0; k < formatSchemaFiles.length; ++k) {
      const formatSchemaName = formatSchemaFiles[k];
      const formatVersion = formatSchemaName.replace(".json", "");
      const formatSchemaPath = path.join(formatTypeDir, formatSchemaName);

      try {
        // Parse the JSON schema
        const formatSchema = JSON.parse(
          fs.readFileSync(formatSchemaPath, { encoding: "utf-8" })
        );

        // Insert the __type property for introspection
        formatSchema.properties["__type"] = {
          type: "string",
          const: formatSchema.id,
        };
        formatSchema.required = [...formatSchema.required, "__type"];

        formatSchemas.push(formatSchema);

        // Convert it to a TypeScript interface
        const tsFile = await JsonSchema.compile(formatSchema, formatSchema.id);

        // Emit the result
        const tsOutputPath = path.join(formatOutputDir, `${formatVersion}.ts`);
        fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
        os.writeFileSync(
          tsOutputPath,
          `/* eslint-disable @typescript-eslint/naming-convention */\n${tsFile}`
        );

        // Add metadata for the root index.ts file to use
        formatModules.push({
          interface: formatSchema.id,
          version: formatVersion,
        });
      } catch (error) {
        console.error(
          `Error generating the Manifest file ${formatSchemaPath}: `,
          error
        );
        throw error;
      }
    }

    const renderTemplate = (name: string, context: unknown) => {
      const tsTemplate = fs.readFileSync(
        path.join(__dirname, `/templates/${name}-ts.mustache`),
        { encoding: "utf-8" }
      );

      // Render the template
      const tsSrc = Mustache.render(tsTemplate, context);

      // Emit the source
      const tsOutputPath = path.join(formatOutputDir, `${name}.ts`);
      fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
      os.writeFileSync(tsOutputPath, tsSrc);
    };

    const lastItem = <T>(arr: Array<T>) => arr[arr.length - 1];
    const versionToTs = (version: string) =>
      version.replace(/\./g, "_").replace(/\-/g, "_");

    const formats = formatModules.map((module) => {
      return {
        type: module.interface,
        version: module.version,
        tsVersion: versionToTs(module.version),
      };
    });
    const latest = lastItem(formats);

    // Generate an index.ts file that exports root types that aggregate all versions
    const indexContext = {
      formats,
      latest,
    };

    renderTemplate("index", indexContext);

    // Generate a migrate.ts file that exports a migration function from all version to the latest version
    const migrateContext = {
      prevFormats: [...formats],
      latest: latest,
    };
    migrateContext.prevFormats.pop();

    renderTemplate("migrate", migrateContext);

    // Generate a deserialize.ts file that exports a deserialization function for the latest format version
    const deserializeContext = {
      type: migrateContext.latest.type,
    };

    renderTemplate("deserialize", deserializeContext);

    // Generate a validate.ts file that validates the manifest against the JSON schema
    const validateFormats = formatModules.map((module) => {
      return {
        type: module.interface,
        version: module.version,
        tsVersion: versionToTs(module.version),
        dir: formatTypeName,
      };
    });

    const validateContext = {
      formats: validateFormats,
      latest: lastItem(validateFormats),
      validators: [] as string[],
    };

    // Extract all validators
    for (let k = 0; k < formatSchemas.length; ++k) {
      const formatSchema = formatSchemas[k];

      const getValidator = (obj: Record<string, unknown>) => {
        if (typeof obj !== "object") {
          return;
        }

        if (obj.format && typeof obj.format === "string") {
          if (validateContext.validators.indexOf(obj.format) === -1) {
            validateContext.validators.push(obj.format);
          }
        }

        const keys = Object.keys(obj);
        for (let j = 0; j < keys.length; ++j) {
          getValidator(obj[keys[j]] as Record<string, unknown>);
        }
      };

      getValidator(formatSchema);
    }

    renderTemplate("validate", validateContext);
  }

  return Promise.resolve();
}

generateFormatTypes()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.abort();
  });
