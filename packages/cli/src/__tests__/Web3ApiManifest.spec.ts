import fs from "fs";
import path from "path";
import { Manifest } from "@web3api/core-js";
import { Web3ApiManifest } from "../lib/Web3ApiManifest";

describe("Web3ApiManifest validation", () => {
  it("Should throw an error when loading an invalid manifest file", () => {
    expect(() => Web3ApiManifest.load("nonExistingPath")).toThrowError();
  });

  it("Should dump & load manifest properly", () => {
    const manifestPath = path.join(__dirname, "web3api.yaml");
    const sampleManifest: Manifest = {
      format: "0.0.1-prealpha.1",
      description: "Test Manifest",
      repository: "https://github.com",
      mutation: {
        schema: { file: "./src/mutation/schema.graphql" },
        module: {
          language: "wasm/assemblyscript",
          file: "./src/mutation/index.ts",
        },
      },
      query: {
        schema: { file: "./src/query/schema.graphql" },
        module: {
          language: "wasm/assemblyscript",
          file: "./src/query/index.ts",
        },
      },
      import_redirects: [
        {
          uri: "w3://ens/ethereum.test.eth",
          schema: "../../../packages/js/plugins/ethereum/src/schema.graphql",
        },
      ],
    };

    if (fs.existsSync(manifestPath)) {
      fs.unlinkSync(manifestPath);
    }

    Web3ApiManifest.dump(sampleManifest, manifestPath);
    const manifest = Web3ApiManifest.load(manifestPath);
    expect(manifest).toEqual(sampleManifest);

    fs.unlinkSync(manifestPath);
  });
});
