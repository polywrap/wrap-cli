import fs from "fs";
import path from "path";
import yaml from "yaml";

import { clearStyle, parseOutput, polywrapCli } from "./utils";

import { buildWrapper, runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";

jest.setTimeout(200000);

const HELP = `Usage: polywrap run|r [options]

Runs Workflows

Options:
  -m, --manifest-file  <path>           Path to the Polywrap Workflow manifest
                                        file (default: polywrap.test.yaml |
                                        polywrap.test.yml)
  -c, --client-config <config-path>     Add custom configuration to the
                                        PolywrapClient
  -o, --output-file <output-file-path>  Output file path for the workflow
                                        result
  -j, --jobs <jobs...>                  Specify ids of jobs that you want to
                                        run
  -q, --quiet                           Suppress output
  -h, --help                            display help for command
`;

describe("e2e tests for run command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "run");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !isNaN(parseInt(dirent.name)))
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number): string =>
    path.join(testCaseRoot, testCases[index]);

  const getCmdArgs = (testCaseDir: string): string[] => {
    const cmdArgs: string[] = [];
    const cmdFile = path.join(testCaseDir, "cmd.json");
    if (fs.existsSync(cmdFile)) {
      const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
      if (cmdConfig.args) {
        cmdArgs.push(...cmdConfig.args);
      }
    }
    return cmdArgs;
  }

  beforeAll(async () => {
    const wrapperPath = path.join(testCaseRoot, "run-test-wrapper");
    await buildWrapper(wrapperPath);
  });

  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["run", "--help"],
      cwd: getTestCaseDir(0),
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  describe("missing option arguments", () => {
    const missingOptionArgs = {
      "--client-config": "-c, --client-config <config-path>",
      "--output-file": "-o, --output-file <output-file-path>",
      "--jobs": "-j, --jobs <jobs...>",
    };

    for (const [option, errorMessage] of Object.entries(missingOptionArgs)) {
      it(`Should throw error if params not specified for ${option} option`, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["run", option],
          cwd: getTestCaseDir(0),
          cli: polywrapCli,
        });

        expect(code).toEqual(1);
        expect(error).toBe(
          `error: option '${errorMessage}' argument missing\n`
        );
        expect(output).toEqual(``);
      });
    }
  });

  it("Should successfully return response: using yaml workflow", async () => {
    const testCaseDir = getTestCaseDir(0);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);

    const output = parseOutput(stdout);
    output.forEach((item) => {
      expect(item.error).toBeUndefined();
      expect(item.data).toBeDefined();
    });
    expect(output).toHaveLength(4);
  });

  it("Should successfully return response: using json workflow", async () => {
    const testCaseDir = getTestCaseDir(1);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);

    const output = parseOutput(stdout);
    output.forEach((item) => {
      expect(item.error).toBeUndefined();
      expect(item.data).toBeDefined();
    });
    expect(output).toHaveLength(4);
  });

  it("Should successfully create json output file if specified", async () => {
    const testCaseDir = getTestCaseDir(2);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);

    expect(parseOutput(stdout)).toMatchObject(
      JSON.parse(
        fs.readFileSync(
          path.join(testCaseDir, "output.json"),
          "utf8"
        )
      )
    );

    fs.unlinkSync(`${testCaseDir}/output.json`);
  });

  it("Should successfully create yaml output file if specified", async () => {
    const testCaseDir = getTestCaseDir(3);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);

    expect(parseOutput(stdout)).toMatchObject(
      JSON.parse(
        JSON.stringify(
          (yaml.parse(
            fs.readFileSync(
              path.join(testCaseDir, "output.yaml"),
              "utf8"
            )
          ) as unknown) as Array<unknown>
        )
      )
    );

    fs.unlinkSync(`${testCaseDir}/output.yaml`);
  });

  it("Should suppress the output if --quiet option is specified", async () => {
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", "--quiet" ],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);
    expect(stdout).toBeFalsy();
  });

  it("Should validate output", async () => {
    const testCaseDir = getTestCaseDir(4);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);
    expect(stdout).toBeTruthy();

    const output = parseOutput(stdout);
    expect(output.filter((o => o.status === "SUCCEED"))).toHaveLength(output.length);
    expect(output.filter((o => o.validation === "SUCCEED"))).toHaveLength(output.length);
  });

  it("Should print error on stderr if validation fails", async () => {
    const testCaseDir = getTestCaseDir(5);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(exitCode).toEqual(1);

    const output = parseOutput(stdout);

    expect(output[0].status).toBe("SUCCEED");
    expect(output[0].validation).toBe("FAILED");
    expect(output[0].error).toBeTruthy();

    expect(stderr).toBeDefined();
    expect(stderr).not.toBe("");
    expect(stderr.indexOf("conflicting values")).toBeGreaterThan(-1);
  });

  it("Should print error on stderr if manifest is invalid", async () => {
    const testCaseDir = getTestCaseDir(6);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBeDefined();
    const err = "Validation errors encountered while sanitizing PolywrapWorkflow";
    expect(stderr.indexOf(err)).toBeGreaterThan(-1);
    expect(exitCode).toEqual(1);
  });

  it("Should accept custom client configuration", async () => {
    const testCaseDir = getTestCaseDir(7);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);
    expect(stdout).toBeTruthy();

    const output = parseOutput(stdout);
    expect(output[0].status).toBe("SUCCEED");
    expect(output[0].validation).toBe("SUCCEED");
    expect(output[0].error).toBeFalsy();
  });

  it("Should access nested properties of referenced result objects", async () => {
    const testCaseDir = getTestCaseDir(8);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);
    expect(stdout).toBeTruthy();

    const output = parseOutput(stdout);
    expect(output.filter((o => o.status === "SUCCEED"))).toHaveLength(output.length);
    expect(output.filter((o => o.validation === "SUCCEED"))).toHaveLength(output.length);
  });

  it("Should print error on stderr if job is named 'data' or 'error'", async () => {
    const testCaseDir = getTestCaseDir(9);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBeDefined();
    const err = "Reserved job name 'data' or 'error' found in job";
    expect(stderr.indexOf(err)).toBeGreaterThan(-1);
    expect(exitCode).toEqual(1);
  });

  it("Should run and validate a subset of ids", async () => {
    const testCaseDir = getTestCaseDir(10);
    const args = getCmdArgs(testCaseDir);
    const { exitCode, stdout, stderr } = await runCLI({
      args: ["run", ...args],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");
    expect(exitCode).toEqual(0);
    expect(stdout).toBeTruthy();

    const output = parseOutput(stdout);
    expect(output[0].id).toBe("case2.0");
    expect(output[0].status).toBe("SUCCEED");
    expect(output[0].validation).toBe("SUCCEED");
    expect(output[0].error).toBeFalsy();
  });
});
