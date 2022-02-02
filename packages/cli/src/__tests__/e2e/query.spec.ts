import fs from "fs";
import path from "path";
import yaml from "js-yaml";

import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import { normalizeLineEndings } from "@web3api/os-js";

const HELP = `
w3 query [options] <recipe-script>

Options:
  -t, --test-ens  Use the development server's ENS instance
  -c, --client-config <config-path> Add custom configuration to the Web3ApiClient

`;

const projectRoot = path.resolve(__dirname, "../project/");

describe("sanity tests for query command", () => {
  test("Should throw error for missing recipe-string", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["query"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(exitCode).toEqual(0);
    expect(stderr).toBe("");
    expect(clearStyle(stdout))
      .toEqual(`Required argument <recipe-script> is missing
${HELP}`);
  });

  test("Should throw error is --client-config doesn't contain arguments", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["query", "./recipes/e2e.json", "--client-config"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(exitCode).toEqual(0);
    expect(stderr).toBe("");
    expect(clearStyle(stdout))
      .toEqual(`--client-config option missing <config-path> argument
${HELP}`);
  });
});

describe.only("e2e tests for query command", () => {
  beforeAll(async () => {
    const { exitCode: testenvCode, stderr: testEnvUpErr } = await runCLI({
      args: ["test-env", "up"],
      cwd: projectRoot,
      cli: w3Cli,
    });
    expect(testEnvUpErr).toBe("");
    expect(testenvCode).toEqual(0);
  });

  afterAll(async () => {
    await runCLI({
      args: ["test-env", "down"],
      cwd: projectRoot,
      cli: w3Cli,
    });
  });

  test("Should use custom config for client if specified", async () => {
    const configs = ["./client-config.ts", "./client-config.js"];

    for (const config of configs) {
      const { exitCode, stdout, stderr } = await runCLI({
        args: [
          "query",
          "./recipes/e2e.json",
          "--test-ens",
          "--client-config",
          config,
        ],
        cwd: projectRoot,
        cli: w3Cli,
      });

      expect(stderr).toBeFalsy();
      expect(stdout).toBeTruthy();

      expect(exitCode).toEqual(0);
      expect(stderr).toBe("");

      const constants = require(`${projectRoot}/recipes/constants.json`);
      expect(clearStyle(normalizeLineEndings(stdout, "\n")))
        .toContain(`-----------------------------------
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
    "value": 569,
    "txReceipt": "0xdone"
  }
}
-----------------------------------`);
    }
  }, 48000);

  test("Should successfully return response: using json recipes", async () => {
    const { stderr: deployErr } = await runCLI({
      args: ["./deploy-contracts.js"],
      cwd: projectRoot,
      cli: " ",
    });

    expect(deployErr).toBe("");

    const { exitCode: buildCode, stderr: buildErr } = await runCLI({
      args: [
        "build",
        "--ipfs",
        "http://localhost:5001",
        "--test-ens",
        "simplestorage.eth",
      ],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(buildErr).toBe("");
    expect(buildCode).toEqual(0);

    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.json", "--test-ens"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = require(`${projectRoot}/recipes/constants.json`);
    expect(clearStyle(normalizeLineEndings(output, "\n")))
      .toContain(`-----------------------------------
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
  }, 480000);

  test("Should successfully return response: using yaml recipes", async () => {
    const { stderr: deployErr } = await runCLI({
      args: ["./deploy-contracts.js"],
      cwd: projectRoot,
      cli: " ",
    });

    expect(deployErr).toBe("");

    const { exitCode: buildCode, stderr: buildErr } = await runCLI({
      args: [
        "build",
        "--ipfs",
        "http://localhost:5001",
        "--test-ens",
        "simplestorage.eth",
      ],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(buildErr).toBe("");
    expect(buildCode).toEqual(0);

    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.yaml", "--test-ens"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = yaml.load(
      await fs.promises.readFile(
        `${projectRoot}/recipes/constants.yaml`,
        "utf8"
      )
    ) as { SimpleStorageAddr: string };

    expect(clearStyle(normalizeLineEndings(output, "\n")))
      .toContain(`-----------------------------------
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
  }, 480000);

  test("Should successfully return response: using mix of yaml & json recipes", async () => {
    const { stderr: deployErr } = await runCLI({
      args: ["./deploy-contracts.js"],
      cwd: projectRoot,
      cli: " ",
    });

    expect(deployErr).toBe("");

    const { exitCode: buildCode, stderr: buildErr } = await runCLI({
      args: [
        "build",
        "--ipfs",
        "http://localhost:5001",
        "--test-ens",
        "simplestorage.eth",
      ],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(buildErr).toBe("");
    expect(buildCode).toEqual(0);

    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.json", "--test-ens"],
      cwd: projectRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = yaml.load(
      await fs.promises.readFile(
        `${projectRoot}/recipes/constants.yaml`,
        "utf8"
      )
    ) as { SimpleStorageAddr: string };

    expect(clearStyle(normalizeLineEndings(output, "\n")))
      .toContain(`-----------------------------------
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
  }, 480000);
});
