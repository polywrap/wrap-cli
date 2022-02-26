import { deserializeAppManifest } from "../manifest";
import { importNamespace, appLanguage } from "../manifest/validators";

import fs from "fs";

describe("App manifest validator", () => {

  it("appLanguage validator", () => {
    expect(appLanguage("app/typescript")).toBeTruthy();
    expect(appLanguage("app/notALanguage")).toBeTruthy();
    expect(appLanguage("typescript")).toBeFalsy();
    expect(appLanguage("plugin/typescript")).toBeFalsy();
  });

  it("namespace validator", () => {
    // should accept any string that is a valid javascript class and property name
    expect(importNamespace("Hi")).toBeTruthy();
    expect(importNamespace("hi")).toBeTruthy();
    expect(importNamespace("_Hi")).toBeTruthy();
    expect(importNamespace("hi_")).toBeTruthy();
    expect(importNamespace("H_i")).toBeTruthy();
    expect(importNamespace("Hi42")).toBeTruthy();
    expect(importNamespace("_Hi_42_")).toBeTruthy();
    // should reject any string that is NOT a valid class or property name
    expect(importNamespace("42hi")).toBeFalsy();
    expect(importNamespace("hi-hello")).toBeFalsy();
  });

  it("deserialize: duplicate namespaces", async () => {
    const manifestPath = __dirname + "/manifest/web3api.app/duplicate-namespace/web3api.app.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    expect(() => deserializeAppManifest(manifest)).toThrowError(
      /instance.imports.web3apis does not conform to the \"uniqueNamespaceArray\" format/
    );
  });
});
