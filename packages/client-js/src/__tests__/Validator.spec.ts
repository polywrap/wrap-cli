import fs from "fs";
import YAML from "js-yaml";

import { manifestValidation, Manifest, migrator } from "../manifest";

jest.mock("../manifest/migrations.json");

describe("Validate web3api manifest ", () => {
  it("Should throw file string does not exist error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/file-string-doesnt-exist/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(
      /a file that does not exists/
    );
  });
  it("Should throw incorrect version format error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/incorrect-version-format/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(
      /Version format it's not correct/
    );
  });
  it("Should throw not accepted field error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/not-accepted-field/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(
      /is not accepted in the schema/
    );
  });
  it("Should throw required field missing error ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/required-field-missing/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));
    expect(() => manifestValidation(manifest as Manifest)).toThrowError(
      /Missing field:/
    );
  });
  it("Should throw wrong type errpr ", async () => {
    const manifestPath =
      __dirname + "/manifest/validator/wrong-type/web3api.yml";
    const manifest = YAML.safeLoad(fs.readFileSync(manifestPath, "utf-8"));

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(
      /has a type error: /
    );
  });
});

describe("Manifest migration ", () => {
  it("Should tell that is a new migration version ", () => {
    const manifestPath = __dirname + "/manifest/migrator/new-version/web3api.yml";
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest;

    const isNew = migrator(manifest);
    expect(isNew).toBe(true);
  });

  it("Should upgrade manifest ", () => {
    const manifestPath = __dirname + "/manifest/migrator/old-version/web3api.yml";
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    ) as Manifest;

    const isNew = migrator(manifest);
    expect(isNew).toBe(false);

    const newManifest = YAML.safeLoad(
      fs.readFileSync("./web3api.yml", "utf-8")
    ) as Manifest;

    expect(newManifest.version).toBe("0.0.3");
  });
});

// Notes
/*
  - all the other changes I just pushed
  - in the migrator, it should figure out what version it's going FROM, and what version it's going TO
  - Call the migrator(s) for that translation
*/

const migrators = {
  "0.0.1-alpha.1": {
    upgrades: {
      "0.0.1-alpha.0": require("./migrators/0.0.2-0.0.3"),
    }
  }
}

const from = "0_0_1-alpha_0"
const to = "0_0_2"

// find a path in the migrators
