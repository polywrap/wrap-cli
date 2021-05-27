import path from "path";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { normalizeLineEndings } from "@web3api/os-js";

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
    }, w3Cli);

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
    }, w3Cli);
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
    }, w3Cli);

    expect(buildErr).toBe("");
    expect(buildCode).toEqual(0);

    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.json", "--test-ens"],
      cwd: projectRoot
    }, w3Cli);

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = require(`${projectRoot}/recipes/constants.json`);
    expect(clearStyle(normalizeLineEndings(output, "\n"))).toContain(`-----------------------------------
mutation {
  setData(
    options: {
      address: $address
      value: $value
    }
    connection: {
      networkNameOrChainId: $network
    }
  ) {
    value
    txReceipt
  }
}

{
  "address": "${constants.SimpleStorageAddr}",
  "value": 569,
  "network": "testnet"
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
    }, w3Cli);
  }, 240000);
});
