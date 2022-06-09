import fs from "fs";
import path from "path";
import yaml from "js-yaml";

import { clearStyle, parseOutput, w3Cli } from "./utils";

import {
  buildAndDeployApi,
  initTestEnvironment,
  runCLI,
} from "@web3api/test-env-js";
import { GetPathToCliTestFiles } from "@web3api/test-cases";

jest.setTimeout(200000);

const HELP = `Usage: w3 run|r [options] <workflow>

Runs workflow script

Arguments:
  workflow                              Path to workflow script

Options:
  -c, --client-config <config-path>     Add custom configuration to the
                                        Web3ApiClient
  -o, --output-file <output-file-path>  Output file path for the workflow
                                        result
  -j, --jobs <jobs...>                  Specify ids of jobs that you want to
                                        run
  -q, --quiet                           Suppress output
  -h, --help                            display help for command
`;

describe("sanity tests for workflow command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/run");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["run", "--help"],
      cwd: testCaseRoot,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for missing workflow-string", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(exitCode).toEqual(1);
    expect(stderr).toContain("error: missing required argument 'workflow'");
    expect(stdout).toEqual(``);
  });

  test("Should throw error is --client-config doesn't contain arguments", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", "./recipes/e2e.json", "--client-config"],
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

describe("e2e tests for run command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/run");

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
      ensAddress: ens,
      registrarAddress,
      resolverAddress,
    } = await initTestEnvironment();

    await buildAndDeployApi({
      apiAbsPath: testCaseRoot,
      ipfsProvider: ipfs,
      ethereumProvider: ethereum,
      ensRegistrarAddress: registrarAddress,
      ensResolverAddress: resolverAddress,
      ensRegistryAddress: ens,
      ensName: "simple-storage.eth",
    });
  });

  afterAll(async () => {
    await runCLI({
      args: ["test-env", "down"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });
  });

  test("Should successfully return response: using json workflow", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: ["run", "./workflows/e2e.json", "-c", "./workflows/config.ts"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });
    expect(code).toEqual(0);
    expect(stderr).toBe("");

    const output = parseOutput(stdout);
    output.forEach((item) => {
      expect(item.error).toBeUndefined();
      expect(item.data).toBeDefined();
    });
    expect(output).toHaveLength(3);
  }, 480000);

  test("Should successfully return response: using yaml workflow", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: ["run", "./workflows/e2e.yaml", "-c", "./workflows/config.ts"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(stderr).toBe("");

    const output = parseOutput(stdout);
    output.forEach((item) => {
      expect(item.error).toBeUndefined();
      expect(item.data).toBeDefined();
    });
    expect(output).toHaveLength(3);
  }, 480000);

  test("Should successfully create json output file if specified", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: [
        "run",
        "./workflows/e2e.json",
        "-c",
        "./workflows/config.ts",
        "--output-file",
        "./workflows/output.json",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(stderr).toBe("");
    expect(parseOutput(stdout)).toMatchObject(
      JSON.parse(
        fs.readFileSync(
          path.join(testCaseRoot, "workflows/output.json"),
          "utf8"
        )
      )
    );

    fs.unlinkSync(`${testCaseRoot}/workflows/output.json`);
  }, 48000);

  test("Should successfully create yaml output file if specified", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: [
        "run",
        "./workflows/e2e.json",
        "-c",
        "./workflows/config.ts",
        "--output-file",
        "./workflows/output.yaml",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(stderr).toBe("");
    expect(parseOutput(stdout)).toMatchObject(
      JSON.parse(
        JSON.stringify(
          (yaml.load(
            fs.readFileSync(
              path.join(testCaseRoot, "workflows/output.yaml"),
              "utf8"
            )
          ) as unknown) as Array<unknown>
        )
      )
    );

    fs.unlinkSync(`${testCaseRoot}/workflows/output.yaml`);
  }, 48000);

  test("Should suppress the ouput if --quiet option is specified", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: [
        "run",
        "./workflows/e2e.json",
        "-c",
        "./workflows/config.ts",
        "--quiet",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(code).toEqual(0);
    expect(stderr).toBe("");
    expect(stdout).toBeFalsy();
  }, 48000);
});
