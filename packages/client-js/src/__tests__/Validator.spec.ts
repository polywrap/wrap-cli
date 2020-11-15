import fs from "fs";
import YAML from "js-yaml";

import {
  sanitizeAndUpgrade,
  upgradeManifest,
  ManifestVersions,
} from "../manifest";
import { Manifest } from "../manifest/versions/0.0.1-alpha.1";

describe("Validate web3api manifest ", () => {
  it("Should throw file string does not exist error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/file-string-doesnt-exist/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(
      /a file that does not exists/
    );
  });
  it("Should throw incorrect version format error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/incorrect-version-format/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(
      /Version format it's not correct/
    );
  });
  it("Should throw not accepted field error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/not-accepted-field/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(
      /is not accepted in the schema/
    );
  });
  it("Should throw required field missing error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/required-field-missing/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));
    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(
      /Missing field:/
    );
  });
  it("Should throw wrong type errpr ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/wrong-type/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => sanitizeAndUpgrade(manifest as Manifest)).toThrowError(
      /has a type error: /
    );
  });
});

describe("Manifest migration ", () => {
  it("Should upgrade 0.0.1-alpha.1 to 0.0.1-alpha.2 ", () => {
    const manifestPath =
      __dirname + "/manifest/migrator/version-0.0.1-alpha.1/web3api.yml";
    const newManifestPath =
      __dirname + "/manifest/migrator/version-0.0.1-alpha.2/web3api.yml";
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest;

    const manifestGenerated = upgradeManifest(
      manifest,
      "0.0.1-alpha.2" as ManifestVersions
    );
    const newManifest = YAML.safeLoad(
      fs.readFileSync(newManifestPath, "utf-8")
    );

    expect(manifestGenerated).toEqual(newManifest);
  });

  it("Should throw error because is unrecognized version ", () => {
    const manifestPath =
      __dirname + "/manifest/migrator/unrecognized-version/web3api.yml";
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest;
    expect(() =>
      upgradeManifest(manifest, "0.0.1-alpha.2" as ManifestVersions)
    ).toThrowError(/Unrecognized manifest version/);
  });

  it("Should throw error because is from version does not has migrator ", () => {
    const manifestPath =
      __dirname + "/manifest/migrator/version-0.0.1-alpha.2/web3api.yml";
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest;
    expect(() =>
      upgradeManifest(manifest, "0.0.1-alpha.3" as ManifestVersions)
    ).toThrowError(/From version 0.0.1-alpha.2 migrator does not exists/);
  });

  it("Should throw error because to version does not exists in migrator ", () => {
    const manifestPath =
      __dirname + "/manifest/migrator/version-0.0.1-alpha.1/web3api.yml";
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest;
    expect(() =>
      upgradeManifest(manifest, "0.0.1-alpha.3" as ManifestVersions)
    ).toThrowError(/Version to update 0.0.1-alpha.3 is not available in migrator of version 0.0.1-alpha.1/);
  });
});
