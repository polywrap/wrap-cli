import path from "path";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP = `
w3 query [options] <recipe-script>

Options:
  -t, --test-ens  Use the development server's ENS instance

`;

describe("e2e tests for query command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should throw error for missing recipe-string", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["query"],
      cwd: projectRoot
    }, "../../../bin/w3");

    expect(exitCode).toEqual(0);
    expect(stderr).toBe("");
    expect(clearStyle(stdout))
      .toEqual(`Required argument <recipe-script> is missing
${HELP}`);
  });

  test("Should successfully return response", async () => {
    const { exitCode: testenvCode, stderr: testEnvUpErr } = await runCLI({
      args: ["test-env", "up"],
      cwd: projectRoot
    }, "../../../bin/w3");
    expect(testEnvUpErr).toBe("");
    expect(testenvCode).toEqual(0);

    const { stderr: deployErr } = await runCLI({
      args: ["./deploy-contracts.js"],
      cwd: projectRoot
    }, "node");

    expect(deployErr).toBe("");

    const { exitCode: buildCode, stderr: buildErr } = await runCLI({
      args: [
        "build",
        "--ipfs",
        "http://localhost:5001",
        "--test-ens",
        "simplestorage.eth",
      ],
      cwd: projectRoot
    }, "../../../bin/w3");

    expect(buildCode).toEqual(0);
    expect(buildErr).toBe("");

    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.json", "--test-ens"],
      cwd: projectRoot
    }, "../../../bin/w3");

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = require(`${projectRoot}/recipes/constants.json`);
    expect(clearStyle(output)).toContain(`-----------------------------------
mutation {
  setData(
    options: {
      address: $address
      value: $value
    }
  ) {
    value
    txReceipt
  }
}

{
  "address": "${constants.SimpleStorageAddr}",
  "value": 569
}
-----------------------------------
-----------------------------------
{
  "setData": {
    "txReceipt": "0x`);
      expect(clearStyle(output)).toContain(`",
    "value": 569
  }
}
-----------------------------------
`);

    await runCLI({
      args: ["test-env", "down"],
      cwd: projectRoot
    }, "../../../bin/w3");
  }, 240000);
});
