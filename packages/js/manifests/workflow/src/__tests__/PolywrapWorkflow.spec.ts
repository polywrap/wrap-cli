import { deserializePolywrapWorkflow } from "../";

import fs from "fs";

describe("Polywrap Script Validation", () => {
  it("Should throw incorrect version format error", async () => {
    const scriptPath = __dirname + "/script/workflow/incorrect-version-format/e2e.yaml";
    const script = fs.readFileSync(scriptPath, "utf-8");

    expect(() => deserializePolywrapWorkflow(script)).toThrowError(/Unrecognized PolywrapWorkflow schema format/);
  });
  it("Should throw not accepted field error", async () => {
    const scriptPath = __dirname + "/script/workflow/not-accepted-field/e2e.yaml";
    const script = fs.readFileSync(scriptPath, "utf-8");

    expect(() => deserializePolywrapWorkflow(script)).toThrowError(/not allowed to have the additional property "not_accepted_field"/);
  });
  it("Should throw required field missing error", async () => {
    const scriptPath = __dirname + "/script/workflow/required-field-missing/e2e.yaml";
    const script = fs.readFileSync(scriptPath, "utf-8");
    expect(() => deserializePolywrapWorkflow(script)).toThrowError(/instance requires property "name"/);
  });
  it("Should throw wrong type error", async () => {
    const scriptPath = __dirname + "/script/workflow/wrong-type/e2e.yaml";
    const script = fs.readFileSync(scriptPath, "utf-8");

    expect(() => deserializePolywrapWorkflow(script)).toThrowError(/instance.format is not of a type\(s\) string/);
  });
});
