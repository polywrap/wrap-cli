const SchemaToTypescript = require("json-schema-to-typescript");
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
  const formatTypes = fs.readdirSync(
    formatsDir, { withFileTypes: true }
  ).filter((dirent) => dirent.isDirectory);

  // For each format type
  for (let i = 0; i < formatTypes.length; ++i) {
    const formatTypeName = formatTypes[i].name;
    const formatTypeDir = path.join(formatsDir, formatTypeName);
    const formatModules = [];

    // Get all JSON schemas for this format type (v1, v2, etc)
    const formatSchemas = fs.readdirSync(formatTypeDir);

    for (let k = 0; k < formatSchemas.length; ++k) {
      const formatSchemaName = formatSchemas[k];
      const formatVersion = formatSchemaName.replace(".json", "");
      const formatSchemaPath = path.join(formatTypeDir, formatSchemaName);

      try {
        // Parse the JSON schema
        const formatSchema = JSON.parse(
          fs.readFileSync(formatSchemaPath, { encoding: "utf-8" })
        );

        // Convert it to a TypeScript interface
        const tsFile = await SchemaToTypescript.compile(
          formatSchema,
          formatSchema.id
        );

        // Emit the result
        const tsOutputPath = path.join(__dirname, `/../../src/manifest/formats/${formatTypeName}/${formatVersion}.ts`);
        fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
        fs.writeFileSync(
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
        __dirname + `/${name}-ts.mustache`, { encoding: "utf-8" }
      );

      // Render the template
      const tsSrc = Mustache.render(tsTemplate, context);

      // Emit the source
      const tsOutputPath = path.join(__dirname, `/../../src/manifest/formats/${formatTypeName}/${name}.ts`);
      fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
      fs.writeFileSync(tsOutputPath, tsSrc);
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
