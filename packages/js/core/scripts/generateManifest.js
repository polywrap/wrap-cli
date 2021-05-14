const SchemaToTypescript = require("json-schema-to-typescript");
const fs = require("fs");
const path = require("path");

async function generateManifest() {
  // Fetch all schemas within the @web3api/manifest-schemas/formats directory
  const formatsDir = path.join(
    path.dirname(require.resolve("@web3api/manifest-schemas")),
    "formats"
  );
  const formatTypes = fs.readdirSync(
    formatsDir, { withFileTypes: true }
  ).filter((dirent) => dirent.isDirectory);

  for (let i = 0; i < formatTypes.length; ++i) {
    const formatTypeName = formatTypes[i].name;
    const formatTypeDir = path.join(formatsDir, formatTypeName);
    const formatSchemas = fs.readdirSync(formatTypeDir);

    for (let k = 0; k < formatSchemas.length; ++k) {
      const formatSchemaName = formatSchemas[k];
      const formatVersion = formatSchemaName.replace(".json", "");
      const formatSchemaPath = path.join(formatTypeDir, formatSchemaName);

      try {
        const formatSchema = JSON.parse(
          fs.readFileSync(formatSchemaPath, { encoding: "utf-8" })
        );
  
        const tsFile = await SchemaToTypescript.compile(
          formatSchema,
          formatSchema.id
        );
  
        const tsOutputPath = path.join(__dirname, `/../src/manifest/formats/${formatTypeName}/${formatVersion}.ts`);
        fs.mkdirSync(path.dirname(tsOutputPath), { recursive: true });
        fs.writeFileSync(
          tsOutputPath,
          `/* eslint-disable @typescript-eslint/naming-convention */\n${tsFile}`
        );
      } catch (error) {
        console.error(`Error generating the Manifest file ${formatSchemaPath}: `, error);
        throw error;
      }
    }
  }

  return Promise.resolve();
};

generateManifest()
  .then(text => {
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.abort();
  });
