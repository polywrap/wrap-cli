const SchemaToTypescript = require("json-schema-to-typescript");
const os = require("@web3api/os-js");
const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

async function generateFormatTypes() {
  // Fetch all schemas within the @web3api/manifest-schemas/formats directory
  const formatsDir = path.join(
    path.dirname(require.resolve("@web3api/manifest-schemas")),
    "formats"
  );

  // Get all format types (web3api, web3api.build, etc)
  const formatTypes = fs
    .readdirSync(formatsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory);

  // For each format type
  for (const formatType of formatTypes) {
    const formatTypeDir = path.join(formatsDir, formatType.name);
    const formatModules = [];

    // Get all JSON schemas for this format type (v1, v2, etc)
    const formatSchemaFiles = fs.readdirSync(formatTypeDir);
    const formatSchemas = [];

    for (const formatSchemaFile of formatSchemaFiles) {
      const formatVersion = formatSchemaFile.replace(".json", "");
      const formatSchemaPath = path.join(formatTypeDir, formatSchemaFile);

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
        const tsFile = await SchemaToTypescript.compile(
          formatSchema,
          formatSchema.id
        );

        // Emit the result
        const tsOutputPath = path.join(
          __dirname,
          `/../../src/manifest/formats/${formatType.name}/${formatVersion}.ts`
        );
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

    const renderTemplate = (name, context) => {
      const tsTemplate = fs.readFileSync(__dirname + `/${name}-ts.mustache`, {
        encoding: "utf-8",
      });

      // Render the template
      const tsSrc = Mustache.render(tsTemplate, context);

      // Emit the source
      const tsOutputPath = path.join(
        __dirname,
        `/../../src/manifest/formats/${formatType.name}/${name}.ts`
      );
      fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
      os.writeFileSync(tsOutputPath, tsSrc);
    };

    const lastItem = (arr) => arr[arr.length - 1];
    const versionToTs = (version) =>
      version.replace(/\./g, "_").replace(/\-/g, "_");

    // Generate an index.ts file that exports root types that aggregate all versions
    const indexContext = {};
    indexContext.formats = formatModules.map((module) => ({
      type: module.interface,
      version: module.version,
      tsVersion: versionToTs(module.version),
    }));
    indexContext.latest = lastItem(indexContext.formats);

    renderTemplate("index", indexContext);

    // Generate a migrate.ts file that exports a migration function from all version to the latest version
    const migrateContext = {};
    migrateContext.prevFormats = formatModules.map((module) => ({
      type: module.interface,
      version: module.version,
      tsVersion: versionToTs(module.version),
    }));
    migrateContext.latest = lastItem(migrateContext.prevFormats);
    migrateContext.prevFormats.pop();

    renderTemplate("migrate", migrateContext);

    // Generate a deserialize.ts file that exports a deserialization function for the latest format version
    const deserializeContext = { type: migrateContext.latest.type };

    renderTemplate("deserialize", deserializeContext);

    // Generate a validate.ts file that validates the manifest against the JSON schema
    const validateContext = {};
    validateContext.formats = formatModules.map((module) => ({
      type: module.interface,
      version: module.version,
      tsVersion: versionToTs(module.version),
      dir: formatType.name,
    }));
    validateContext.latest = lastItem(validateContext.formats);

    // Extract all validators
    validateContext.validators = new Set();

    function searchForValidators(obj, cycleDetector) {
      if (typeof obj !== "object" || cycleDetector.has(obj)) return;
      cycleDetector.add(obj);

      if (obj.format && typeof obj.format === "string")
        validateContext.validators.add(obj.format);

      Object.values(obj).forEach((child) => searchForValidators(child, cycleDetector));
    }

    for (const formatSchema of formatSchemas)
      searchForValidators(formatSchema, new WeakSet());

    validateContext.validators = Array.from(validateContext.validators);
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
