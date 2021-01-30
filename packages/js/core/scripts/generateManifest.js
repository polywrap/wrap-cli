const package = require("../package.json");
const schemaVersion = package.dependencies["@web3api/manifest-schema"];
const schema = require(`@web3api/manifest-schema/formats/${schemaVersion}.json`);
const { compile } = require("json-schema-to-typescript");
const { writeFileSync } = require("fs");

// TODO: Generate all manifests
const generateManifest = () => {
  try {
    compile(schema, "Web3API")
      .then((file) => {
        const manifestPath =
          __dirname + `/../src/manifest/formats/${package.version}.ts`;
        writeFileSync(manifestPath, file);
      })
      .catch((e) => console.error(e));
  } catch (e) {
    console.error("Error generating the Manifest file: ", e);
  }
};

generateManifest();
