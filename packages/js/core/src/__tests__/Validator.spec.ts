import { sanitizeAndUpgrade, upgradeManifest, ManifestFormats } from "../manifest";
import { Manifest } from "../manifest/formats/0.0.1-prealpha.1";

import fs from "fs";
import YAML from "js-yaml";

describe("Validate web3api manifest ", () => {
  it("Should throw file string does not exist error ", async () => {
    const manifestPath = __dirname + "/manifest/validator/file-string-malformed/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(
      /is not a valid file path. Please use unix style relative paths./
    );
  });
  it("Should throw incorrect version format error ", async () => {
    const manifestPath = __dirname + "/manifest/validator/incorrect-version-format/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(/The manifest's format is not correct./);
  });
  it("Should throw not accepted field error ", async () => {
    const manifestPath = __dirname + "/manifest/validator/not-accepted-field/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(/is not accepted in the schema/);
  });
  it("Should throw required field missing error ", async () => {
    const manifestPath = __dirname + "/manifest/validator/required-field-missing/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));
    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(/Missing field:/);
  });
  it("Should throw wrong type errpr ", async () => {
    const manifestPath = __dirname + "/manifest/validator/wrong-type/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(/has a type error: /);
  });
});

describe("Manifest migration ", () => {
  it("Should upgrade 0.0.1-prealpha.1 to 0.0.1-prealpha.2 ", () => {
    const manifestPath = __dirname + "/manifest/migrator/format-0.0.1-prealpha.1/web3api.yml";
    const newManifestPath = __dirname + "/manifest/migrator/format-0.0.1-prealpha.2/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8")) as Manifest;

    const manifestGenerated = upgradeManifest(manifest, "0.0.1-prealpha.2" as ManifestFormats);
    const newManifest = YAML.safeLoad(fs.readFileSync(newManifestPath, "utf-8"));

    expect(manifestGenerated).toEqual(newManifest);
  });

  it("Should throw error because is unrecognized format ", () => {
    const manifestPath = __dirname + "/manifest/migrator/unrecognized-format/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
    expect(() => upgradeManifest(manifest, "0.0.1-prealpha.2" as ManifestFormats)).toThrowError(
      /Unrecognized manifest format/
    );
  });

  it("Should throw error because the from format does not have a migrator", () => {
    const manifestPath = __dirname + "/manifest/migrator/format-0.0.1-prealpha.2/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
    expect(() => upgradeManifest(manifest, "0.0.1-prealpha.3" as ManifestFormats)).toThrowError(
      /From format 0.0.1-prealpha.2 migrator does not exists/
    );
  });

  it("Should throw error because to format does not exists in the migrator", () => {
    const manifestPath = __dirname + "/manifest/migrator/format-0.0.1-prealpha.1/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
    expect(() => upgradeManifest(manifest, "0.0.1-prealpha.3" as ManifestFormats)).toThrowError(
      /Format to update 0.0.1-prealpha.3 is not available in migrator of format 0.0.1-prealpha.1/
    );
  });
});
