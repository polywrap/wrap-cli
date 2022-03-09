import { deserializeAppManifest } from "../manifest";
import { appLanguage } from "../manifest/validators";

import fs from "fs";

describe("App manifest validator", () => {

  it("appLanguage validator", () => {
    expect(appLanguage("app/typescript")).toBeTruthy();
    expect(appLanguage("app/notALanguage")).toBeTruthy();
    expect(appLanguage("typescript")).toBeFalsy();
    expect(appLanguage("plugin/typescript")).toBeFalsy();
  });

  it("deserialize: duplicate namespaces", async () => {
    const manifestPath = __dirname + "/manifest/web3api.app/duplicate-namespace/web3api.app.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    expect(() => deserializeAppManifest(manifest)).toThrow(
      /instance.dependencies.web3apis does not conform to the \"uniqueNamespaceArray\" format/
    );
  });
});
