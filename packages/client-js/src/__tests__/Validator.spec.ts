import fs from "fs";
import YAML from "js-yaml";

import { manifestValidation, Manifest } from "../manifest";

describe("Validate web3api manifest", () => {
  it("File string does not exist ", async () => {
    const manifestPath = __dirname + "/./manifest/validator/file-string-doesnt-exist/web3api.yml"
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    )

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(/a file that does not exists/)
    
  });
  it("Incorrect version format ", async () => {
    const manifestPath = __dirname + "/./manifest/validator/incorrect-version-format/web3api.yml"
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    )

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(/Version format it's not correct/)
    
  });
  it("Not accepted field ", async () => {
    const manifestPath = __dirname + "/./manifest/validator/not-accepted-field/web3api.yml"
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    )

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(/is not accepted in the schema/)
    
  });
  it("Required field missing ", async () => {
    const manifestPath = __dirname + "/./manifest/validator/required-field-missing/web3api.yml"
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    )
      console.log(manifest)
    expect(() => manifestValidation(manifest as Manifest)).toThrowError(/Missing field:/)
    
  });
  it("Wrong type ", async () => {
    const manifestPath = __dirname + "/./manifest/validator/wrong-type/web3api.yml"
    const manifest = YAML.safeLoad(
      fs.readFileSync(manifestPath, "utf-8")
    )

    expect(() => manifestValidation(manifest as Manifest)).toThrowError(/has a type error: /)
    
  });
});
