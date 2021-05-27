const os = require("@web3api/os-js");
const SchemaToTypescript = require("json-schema-to-typescript");
const fs = require("fs");
const path = require("path");

const generateManifest = async () => {
  // Fetch all schemas within the @web3api/manifest-schema/formats directory
  const formatsDir = path.join(
    path.dirname(require.resolve("@web3api/manifest-schema")),
    "/formats"
  );
  const formatFiles = fs.readdirSync(formatsDir);

  for (let i = 0; i < formatFiles.length; ++i) {
    const formatFile = formatFiles[i];

    try {
      const format = JSON.parse(fs.readFileSync(
        path.join(formatsDir, formatFile),
        { encoding:'utf8' }
      ));
      const version = formatFile.replace(".json", "");

      const file = await SchemaToTypescript.compile(format, "Web3API")

      const manifestPath = path.join(__dirname, `/../src/manifest/formats/${version}.ts`);
      os.writeFileSync(
        manifestPath,
        `/* eslint-disable @typescript-eslint/naming-convention */\n${file}`,
        { }
      );
    } catch (e) {
      console.error(`Error generating the Manifest file ${formatFile}: `, e);
      throw e;
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
