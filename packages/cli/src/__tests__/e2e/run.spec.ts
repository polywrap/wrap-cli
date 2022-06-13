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
  -v, --validate-script <cue-file>      Validate the output of the workflow
                                        jobs
  -o, --output-file <output-file-path>  Output file path for the workflow
                                        result
  -j, --jobs <jobs...>                  Specify ids of jobs that you want to
                                        run
  -q, --quiet                           Suppress output
  -h, --help                            display help for command
`;

describe("sanity tests for workflow command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/run");

  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["run", "--help"],
      cwd: testCaseRoot,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should throw error for missing workflow-string", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run"],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    expect(exitCode).toEqual(1);
    expect(stderr).toContain("error: missing required argument 'workflow'");
    expect(stdout).toEqual(``);
  });

  it("Should throw error is --client-config doesn't contain arguments", async () => {
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
    await initTestEnvironment();

    await buildAndDeployApi({
      apiAbsPath: testCaseRoot,
      ipfsProvider: "http://localhost:5001",
      ethereumProvider: "http://localhost:8545",
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

  it("Should successfully return response: using json workflow", async () => {
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

  it("Should successfully return response: using yaml workflow", async () => {
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

  it("Should successfully create json output file if specified", async () => {
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

  it("Should successfully create yaml output file if specified", async () => {
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

  it("Should suppress the ouput if --quiet option is specified", async () => {
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

  it("Should validate output if validate script given", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: [
        "run",
        "./workflows/e2e.json",
        "-c",
        "./workflows/config.ts",
        "-v",
        "./workflows/validator.cue",
        "-q",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    console.log("STDOUT")
    console.log(stdout)
    console.log("STDERR")
    console.log(stderr)

    expect(code).toEqual(0);
    expect(stderr).toBe("");
    expect(stdout).toBe("");

  }, 48000);

  it("Should print error on stderr if validation fails", async () => {
    const { exitCode: code, stderr } = await runCLI({
      args: [
        "run",
        "./workflows/e2e.json",
        "-v",
        "./workflows/validator.cue",
        "-q",
      ],
      cwd: testCaseRoot,
      cli: w3Cli,
    });

    console.log("STDERR")
    console.log(stderr)

    expect(code).toEqual(1);
    expect(stderr).toContain("explicit error (_|_ literal) in source:");
  }, 48000);
});
