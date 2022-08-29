import fs from "fs";
import path from "path";
import yaml from "js-yaml";

import { clearStyle, parseOutput, polywrapCli } from "./utils";

import {
  buildAndDeployWrapper,
  initTestEnvironment,
  runCLI,
} from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";

jest.setTimeout(200000);

const HELP = `Usage: polywrap run|r [options] <workflow>

Runs Workflows

Arguments:
  workflow                              Path to workflow script

Options:
  -c, --client-config <config-path>     Add custom configuration to the
                                        PolywrapClient
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
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/run");

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
      cli: polywrapCli,
    });

    expect(exitCode).toEqual(1);
    expect(stderr).toContain("error: missing required argument 'workflow'");
    expect(stdout).toEqual(``);
  });

  describe("missing option arguments", () => {
    const missingOptionArgs = {
      "--validate-script": "-v, --validate-script <cue-file>",
      "--client-config": "-c, --client-config <config-path>",
      "--output-file": "-o, --output-file <output-file-path>",
      "--jobs": "-j, --jobs <jobs...>",
    };

    for (const [option, errorMessage] of Object.entries(missingOptionArgs)) {
      it(`Should throw error if params not specified for ${option} option`, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["run", option],
          cwd: testCaseRoot,
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
});

describe("e2e tests for run command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/run");

  beforeAll(async () => {
    await initTestEnvironment();

    await buildAndDeployWrapper({
      wrapperAbsPath: testCaseRoot,
      ipfsProvider: "http://localhost:5001",
      ethereumProvider: "http://localhost:8545",
      ensName: "simple-storage.eth",
    });
  });

  afterAll(async () => {
    await runCLI({
      args: ["test-env", "down"],
      cwd: testCaseRoot,
      cli: polywrapCli,
    });
  });

  it("Should successfully return response: using json workflow", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: ["run", "./workflows/e2e.json", "-c", "./workflows/config.ts"],
      cwd: testCaseRoot,
      cli: polywrapCli,
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
      cli: polywrapCli,
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
      cli: polywrapCli,
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
      cli: polywrapCli,
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
      cli: polywrapCli,
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
      ],
      cwd: testCaseRoot,
      cli: polywrapCli,
    });

    const output = parseOutput(stdout);

    expect(stdout).toBeTruthy();
    expect(output.filter((o => o.status === "SUCCEED"))).toHaveLength(output.length);
    expect(stderr).toBe("");
    expect(code).toEqual(0);

  }, 48000);

  it("Should print error on stderr if validation fails", async () => {
    const { exitCode: code, stdout } = await runCLI({
      args: [
        "run",
        "./workflows/e2e.json",
        "-v",
        "./workflows/validator.cue",
      ],
      cwd: testCaseRoot,
      cli: polywrapCli,
    });

    const output = parseOutput(stdout);

    expect(code).toEqual(1);
    expect(output[0].status).toBe("FAILED");
    expect(output[0].error).toBeTruthy();
    expect(output[1].status).toBe("SKIPPED");
    expect(output[2].status).toBe("SKIPPED");
  }, 48000);
});
