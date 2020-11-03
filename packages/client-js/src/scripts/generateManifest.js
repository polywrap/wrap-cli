const schema = require("@web3api/manifest-schema");
const package = require("../../package.json")
const compile = require("json-schema-to-typescript").compile;
const writeFileSync = require("fs").writeFileSync;

const generateManifest = () => {
  try {
    const manifest = schema["manifest"];
    compile(manifest, "Web3API").then((file) => {
      const manifestPath = __dirname + `/../manifest/versions/${package.version}.d.ts`;
      writeFileSync(manifestPath, file);
    });
  } catch (e) {
    console.log("Error generating the Manifest file: ", e);
  }
};

generateManifest();
