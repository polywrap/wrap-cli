const package = require("../package.json");
const schemaVersion = package.devDependencies["@web3api/manifest-schema"];
const schema = require(`@web3api/manifest-schema/formats/${schemaVersion}`);
const { compile } = require("json-schema-to-typescript");
const { writeFileSync } = require("fs");

const generateManifest = () => {
  try {
    const manifest = schema["manifest"];
    compile(manifest, "Web3API").then((file) => {
      const manifestPath =
        __dirname + `/../src/manifest/formats/${package.version}.ts`;
      writeFileSync(manifestPath, file);
    });
  } catch (e) {
    console.log("Error generating the Manifest file: ", e);
  }
};

generateManifest();
