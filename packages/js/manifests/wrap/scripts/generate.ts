import path from "path";
import fs from "fs";
import * as os from "@polywrap/os-js";
import Mustache from "mustache";
import * as JsonSchema from "json-schema-to-typescript";
import { FileInfo } from "json-schema-ref-parser";

async function generateFormatTypes() {
  // Fetch all schemas within the @polywrap/wrap-manifest-schemas/schemas/formats directory
  const schemasPackageDir = path.dirname(
    require.resolve("@polywrap/wrap-manifest-schemas")
  );
  const formatsDir = path.join(schemasPackageDir, "formats");

  // Resolve json-schema to typescript for wrap format type
  const formatTypeName = "wrap.info";
  const formatTypeDir = path.join(formatsDir, formatTypeName);
  const formatOutputDir = path.join(
    __dirname,
    `../src/formats/${formatTypeName}`
  );
  const formatModules: any[] = [];

  // Get all JSON schemas for this format type (v1, v2, etc)
  const formatSchemaFiles = fs.readdirSync(formatTypeDir);
  const formatSchemas: any[] = [];

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

      const abiJsonSchemaRelPath = formatSchema.properties.abi.$ref;
      const abiJsonSchemaPath = path.join(
        formatTypeDir,
        abiJsonSchemaRelPath
      );
      const abiJsonSchema = JSON.parse(
        fs.readFileSync(abiJsonSchemaPath, { encoding: "utf-8" })
      );

      formatSchemas.push(formatSchema);

      // Convert it to a TypeScript interface
      const tsFile = await JsonSchema.compile(formatSchema, formatSchema.id, {
        $refOptions: {
          resolve: {
            file: {
              read: (file: FileInfo) => {
                // If both url is same
                if(!path.relative(abiJsonSchemaRelPath, file.url)) {
                  return abiJsonSchema
                }
                return file.data;
              }
            }
          }
        }
      });

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
