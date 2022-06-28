const SchemaToTypescript = require("json-schema-to-typescript");
const os = require("@polywrap/os-js");
const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

async function generateFormatTypes() {
  // Fetch all schemas within the @polywrap/manifest-schemas/formats directory
  const formatsDir = path.join(
    path.dirname(require.resolve("@polywrap/manifest-schemas")),
    "polywrap"
  );

  // Get all format types (polywrap, polywrap.build, etc)
  const formatTypes = fs.readdirSync(
    formatsDir, { withFileTypes: true }
  ).filter((dirent) => dirent.isDirectory);

  // For each format type
  for (let i = 0; i < formatTypes.length; ++i) {
    const formatTypeName = formatTypes[i].name;
    const formatTypeDir = path.join(formatsDir, formatTypeName);
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
          const: formatSchema.id
        };
        formatSchema.required = [
          ...formatSchema.required,
          "__type"
        ];

        formatSchemas.push(formatSchema);

        console.log({ formatSchema })
        // Convert it to a TypeScript interface
        const tsFile = await SchemaToTypescript.compile(
          formatSchema,
          formatSchema.id
        );

        // Emit the result
        const tsOutputPath = path.join(__dirname, `/../../src/manifest/polywrap/${formatTypeName}/${formatVersion}.ts`);
        fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
        os.writeFileSync(
          tsOutputPath,
          `/* eslint-disable @typescript-eslint/naming-convention */\n${tsFile}`
        );

        // Add metadata for the root index.ts file to use
        formatModules.push({
          interface: formatSchema.id,
          version: formatVersion
        });
      } catch (error) {
        console.error(`Error generating the Manifest file ${formatSchemaPath}: `, error);
        throw error;
      }
    }

    const renderTemplate = (name, context) => {
      const tsTemplate = fs.readFileSync(
        __dirname + `/polywrap/${name}-ts.mustache`, { encoding: "utf-8" }
      );

      // Render the template
      const tsSrc = Mustache.render(tsTemplate, context);

      // Emit the source
      const tsOutputPath = path.join(__dirname, `/../../src/manifest/polywrap/${formatTypeName}/${name}.ts`);
      fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
      os.writeFileSync(tsOutputPath, tsSrc);
    }

    const lastItem = (arr) => arr[arr.length - 1];
    const versionToTs = (version) =>
      version.replace(/\./g, "_").replace(/\-/g, "_");

    // Generate an index.ts file that exports root types that aggregate all versions
    const indexContext = { };
    indexContext.formats = formatModules.map((module) => {
      return {
        type: module.interface,
        version: module.version,
        tsVersion: versionToTs(module.version)
      }
    });
    indexContext.latest = lastItem(indexContext.formats);

    renderTemplate("index", indexContext);

    // Generate a migrate.ts file that exports a migration function from all version to the latest version
    const migrateContext = { };
    migrateContext.prevFormats = formatModules.map((module) => {
      return {
        type: module.interface,
        version: module.version,
        tsVersion: versionToTs(module.version)
      }
    });
    migrateContext.latest = lastItem(migrateContext.prevFormats);
    migrateContext.prevFormats.pop();

    renderTemplate("migrate", migrateContext);

    // Generate a deserialize.ts file that exports a deserialization function for the latest format version
    const deserializeContext = {
      type: migrateContext.latest.type
    };

    renderTemplate("deserialize", deserializeContext);

    // Generate a validate.ts file that validates the manifest against the JSON schema
    const validateContext = { };
    validateContext.formats = formatModules.map((module) => {
      return {
        type: module.interface,
        version: module.version,
        tsVersion: versionToTs(module.version),
        dir: formatTypeName
      };
    });
    validateContext.latest = lastItem(validateContext.formats);

    // Extract all validators
    validateContext.validators = [];

    for (let k = 0; k < formatSchemas.length; ++k) {
      const formatSchema = formatSchemas[k];

      const getValidator = (obj) => {
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
          getValidator(obj[keys[j]]);
        }
      }

      getValidator(formatSchema);
    }

    renderTemplate("validate", validateContext);
  }

  return Promise.resolve();
};

generateFormatTypes()
  .then(text => {
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.abort();
  });
