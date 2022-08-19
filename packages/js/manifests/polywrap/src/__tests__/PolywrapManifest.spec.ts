import { deserializePolywrapManifest } from "../";

import fs from "fs";

describe("Polywrap Manifest Validation", () => {
  it("Should throw file string does not exist error", async () => {
    const manifestPath = __dirname + "/manifest/polywrap/file-string-malformed/polywrap.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    expect(() => deserializePolywrapManifest(manifest)).toThrowError(/instance.schema does not match pattern/);
  });
  it("Should throw incorrect version format error", async () => {
    const manifestPath = __dirname + "/manifest/polywrap/incorrect-version-format/polywrap.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    expect(() => deserializePolywrapManifest(manifest)).toThrowError(/Unrecognized PolywrapManifest schema format/);
  });
  it("Should throw not accepted field error", async () => {
    const manifestPath = __dirname + "/manifest/polywrap/not-accepted-field/polywrap.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    expect(() => deserializePolywrapManifest(manifest)).toThrowError(/not allowed to have the additional property "not_accepted_field"/);
  });
  it("Should throw required field missing error", async () => {
    const manifestPath = __dirname + "/manifest/polywrap/required-field-missing/polywrap.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");
    expect(() => deserializePolywrapManifest(manifest)).toThrowError(/instance requires property "schema"/);
  });
  it("Should throw wrong type error", async () => {
    const manifestPath = __dirname + "/manifest/polywrap/wrong-type/polywrap.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    expect(() => deserializePolywrapManifest(manifest)).toThrowError(/instance.module is not of a type\(s\) string/);
  });
  it("Should deserialize manifest as expected", async () => {
    const manifestPath = __dirname + "/manifest/polywrap/sanity/polywrap.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    const info = deserializePolywrapManifest(manifest)
    expect(info.name).toEqual("package-name")
  });
});
