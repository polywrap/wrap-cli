import { deserializePolywrapWorkflow } from "../";

import fs from "fs";

describe("Polywrap Workflow Validation", () => {
  it("Should throw incorrect version format error", async () => {
    const workflowPath = __dirname + "/manifest/test/incorrect-version-format/polywrap.test.yaml";
    const workflow = fs.readFileSync(workflowPath, "utf-8");

    expect(() => deserializePolywrapWorkflow(workflow)).toThrowError(/Unrecognized PolywrapWorkflow schema format/);
  });
  it("Should throw not accepted field error", async () => {
    const workflowPath = __dirname + "/manifest/test/not-accepted-field/polywrap.test.yaml";
    const workflow = fs.readFileSync(workflowPath, "utf-8");

    expect(() => deserializePolywrapWorkflow(workflow)).toThrowError(/not allowed to have the additional property "not_accepted_field"/);
  });
  it("Should throw required field missing error", async () => {
    const workflowPath = __dirname + "/manifest/test/required-field-missing/polywrap.test.yaml";
    const workflow = fs.readFileSync(workflowPath, "utf-8");
    expect(() => deserializePolywrapWorkflow(workflow)).toThrowError(/instance requires property "name"/);
  });
  it("Should throw wrong type error", async () => {
    const workflowPath = __dirname + "/manifest/test/wrong-type/polywrap.test.yaml";
    const workflow = fs.readFileSync(workflowPath, "utf-8");

    expect(() => deserializePolywrapWorkflow(workflow)).toThrowError(/instance.format is not of a type\(s\) string/);
  });
});
