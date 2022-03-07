import { deserializeAppManifest } from "../manifest";
import { dependencyNamespace, appLanguage } from "../manifest/validators";

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
    expect(dependencyNamespace("Hi")).toBeTruthy();
    expect(dependencyNamespace("hi")).toBeTruthy();
    expect(dependencyNamespace("_Hi")).toBeTruthy();
    expect(dependencyNamespace("hi_")).toBeTruthy();
    expect(dependencyNamespace("H_i")).toBeTruthy();
    expect(dependencyNamespace("Hi42")).toBeTruthy();
    expect(dependencyNamespace("_Hi_42_")).toBeTruthy();
    // should reject any string that is NOT a valid class or property name
    expect(dependencyNamespace("42hi")).toBeFalsy();
    expect(dependencyNamespace("hi-hello")).toBeFalsy();
  });

  it("deserialize: duplicate namespaces", async () => {
    const manifestPath = __dirname + "/manifest/web3api.app/duplicate-namespace/web3api.app.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    expect(() => deserializeAppManifest(manifest)).toThrow(
      /instance.dependencies.web3apis does not conform to the \"uniqueNamespaceArray\" format/
    );
  });
});
