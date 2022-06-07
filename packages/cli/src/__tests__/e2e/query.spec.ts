import fs from "fs";
import path from "path";
import yaml from "js-yaml";

import { clearStyle, w3Cli } from "./utils";

import { buildAndDeployApi, initTestEnvironment, runCLI, stopTestEnvironment } from "@web3api/test-env-js";
import { GetPathToCliTestFiles } from "@web3api/test-cases";
import { normalizeLineEndings } from "@web3api/os-js";
import {
  checkSampleQueryOutput,
  getSampleObjectOutput,
  getSampleOutputWithClientConfig,
  ISampleOutputOptions,
} from "./query.spec.helper";

jest.setTimeout(200000);

const HELP = `Usage: w3 query|q [options] <recipe>

Query Web3APIs using recipe scripts

Arguments:
  recipe                                Path to recipe script

Options:
  -c, --client-config <config-path>     Add custom configuration to the
                                        Web3ApiClient
  -o, --output-file <output-file-path>  Output file path for the query result
  -q, --quiet                           Suppress output
  -h, --help                            display help for command
`;

describe("sanity tests for query command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/query");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["query", "--help"],
      cwd: testCaseRoot,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for missing recipe-string", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["query"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(exitCode).toEqual(1);
    expect(stderr).toContain("error: missing required argument 'recipe");
    expect(stdout).toEqual(``);
  });

  test("Should throw error is --client-config doesn't contain arguments", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["query", "./recipes/e2e.json", "--client-config"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(exitCode).toEqual(1);
    expect(stderr).toBe(
      "error: option '-c, --client-config <config-path> ' argument missing\n"
    );
    expect(stdout).toEqual(``);
  });
});

describe("e2e tests for query command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/query");

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
    } = await initTestEnvironment();

    const { stderr: deployErr } = await runCLI({
      args: ["./deploy-contracts.js"],
      cwd: testCaseRoot,
      cli: " ",
    });

    expect(deployErr).toBe("");

    await buildAndDeployApi({
      apiAbsPath: testCaseRoot,
      ipfsProvider: ipfs,
      ethereumProvider: ethereum,
      ensName: "simplestorage.eth",
    })
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  test("Should successfully return response: using json recipes", async () => {
    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.json"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = require(`${testCaseRoot}/recipes/constants.json`);
    checkSampleQueryOutput(output, {
      SimpleStorageAddr: constants.SimpleStorageAddr,
    });
  }, 480000);

  test("Should successfully return response: using yaml recipes", async () => {
    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.yaml"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = yaml.load(
      await fs.promises.readFile(
        `${testCaseRoot}/recipes/constants.yaml`,
        "utf8"
      )
    ) as ISampleOutputOptions;

    checkSampleQueryOutput(output, {
      SimpleStorageAddr: constants.SimpleStorageAddr,
    });
  }, 480000);

  test("Should successfully return response: using mix of yaml & json recipes", async () => {
    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: ["query", "./recipes/e2e.json"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = yaml.load(
      await fs.promises.readFile(
        `${testCaseRoot}/recipes/constants.yaml`,
        "utf8"
      )
    ) as ISampleOutputOptions;

    checkSampleQueryOutput(output, {
      SimpleStorageAddr: constants.SimpleStorageAddr,
    });
  }, 480000);

  test("Should successfully create json output file if specified", async () => {
    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: [
        "query",
        "./recipes/e2e.json",
        "--output-file",
        "./recipes/output.json",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = require(`${testCaseRoot}/recipes/constants.json`);
    checkSampleQueryOutput(output, {
      SimpleStorageAddr: constants.SimpleStorageAddr,
    });

    expect(fs.existsSync(`${testCaseRoot}/recipes/output.json`)).toBeTruthy();
    const arr: Array<unknown> = JSON.parse(
      fs.readFileSync(`${testCaseRoot}/recipes/output.json`, "utf8")
    );
    expect(Array.isArray(arr)).toBeTruthy();

    expect(arr[2]).toMatchObject(getSampleObjectOutput());

    fs.unlinkSync(`${testCaseRoot}/recipes/output.json`);
  }, 48000);

  test("Should successfully create yaml output file if specified", async () => {
    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: [
        "query",
        "./recipes/e2e.yaml",
        "--output-file",
        "./recipes/output.yaml",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");

    const constants = yaml.load(
      await fs.promises.readFile(
        `${testCaseRoot}/recipes/constants.yaml`,
        "utf8"
      )
    ) as ISampleOutputOptions;

    checkSampleQueryOutput(output, {
      SimpleStorageAddr: constants.SimpleStorageAddr,
    });

    expect(fs.existsSync(`${testCaseRoot}/recipes/output.yaml`)).toBeTruthy();
    const arr: Array<unknown> = (yaml.load(
      fs.readFileSync(`${testCaseRoot}/recipes/output.yaml`, "utf8")
    ) as unknown) as Array<unknown>;
    expect(Array.isArray(arr)).toBeTruthy();
    expect(arr[2]).toMatchObject(getSampleObjectOutput());

    fs.unlinkSync(`${testCaseRoot}/recipes/output.yaml`);
  }, 48000);

  test("Should suppress the ouput if --quiet option is specified", async () => {
    const { exitCode: code, stdout: output, stderr: queryErr } = await runCLI({
      args: [
        "query",
        "./recipes/e2e.json",
        "--quiet",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(queryErr).toBe("");
    expect(output).toBeFalsy();
  }, 48000);

  test("Should use custom config for client if specified", async () => {
    const configs = [
      "./client-config.ts",
      "./client-config.js",
      "./client-async-config.ts",
      "./client-async-config.js",
    ];

    for (const config of configs) {
      const { exitCode, stdout, stderr } = await runCLI({
        args: [
          "query",
          "./recipes/e2e.json",
          "--client-config",
          config,
        ],
        cwd: testCaseRoot,
        cli: w3Cli,
      });

      expect(stderr).toBeFalsy();
      expect(stdout).toBeTruthy();

      expect(exitCode).toEqual(0);
      expect(stderr).toBe("");

      const constants = require(`${testCaseRoot}/recipes/constants.json`);
      expect(clearStyle(normalizeLineEndings(stdout, "\n"))).toContain(
        getSampleOutputWithClientConfig({
          SimpleStorageAddr: constants.SimpleStorageAddr,
        })
      );
    }
  }, 48000);
});
