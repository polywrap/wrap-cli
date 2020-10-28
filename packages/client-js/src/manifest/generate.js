const schema = require("@web3api/manifest-schema").default;
const compile = require("json-schema-to-typescript").compile;
const writeFileSync = require("fs").writeFileSync;

const generateManifest = () => {
  try {
    const manifest = schema["manifest"];
    compile(manifest, "Web3API").then((file) => {
      const manifestPath = __dirname + "/Manifest.ts";
      writeFileSync(manifestPath, file);
    });
  } catch (e) {
    console.log("error ", e);
  }
};

generateManifest();
