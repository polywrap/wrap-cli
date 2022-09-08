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

const HELP = `Usage: polywrap run|r [options]

Runs Workflows

Options:
  -m, --manifest  <manifest>            Workflow Manifest path (default:
                                        "polywrap.test.yaml")
  -c, --client-config <config-path>     Add custom configuration to the
                                        PolywrapClient
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
      args: ["run", "-c", "./client-config.ts", "-m", "./polywrap.test.json"],
      cwd: testCaseRoot,
      cli: polywrapCli,
    });

    expect(stderr).toBe("");

    const output = parseOutput(stdout);
    output.forEach((item) => {
      expect(item.error).toBeUndefined();
      expect(item.data).toBeDefined();
    });
    expect(output).toHaveLength(3);
    expect(code).toEqual(0);
  }, 480000);

  it("Should successfully return response: using yaml workflow", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: ["run", "-c", "./client-config.ts"],
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
        "-c",
        "./client-config.ts",
        "--output-file",
        "./output.json",
      ],
      cwd: testCaseRoot,
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(stderr).toBe("");
    expect(parseOutput(stdout)).toMatchObject(
      JSON.parse(
        fs.readFileSync(
          path.join(testCaseRoot, "output.json"),
          "utf8"
        )
      )
    );

    fs.unlinkSync(`${testCaseRoot}/output.json`);
  }, 48000);

  it("Should successfully create yaml output file if specified", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: [
        "run",
        "-c",
        "./client-config.ts",
        "--output-file",
        "./output.yaml",
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
              path.join(testCaseRoot, "output.yaml"),
              "utf8"
            )
          ) as unknown) as Array<unknown>
        )
      )
    );

    fs.unlinkSync(`${testCaseRoot}/output.yaml`);
  }, 48000);

  it("Should suppress the ouput if --quiet option is specified", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: [
        "run",
        "-c",
        "./client-config.ts",
        "--quiet",
      ],
      cwd: testCaseRoot,
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(stderr).toBe("");
    expect(stdout).toBeFalsy();
  }, 48000);

  it("Should validate output", async () => {
    const { exitCode: code, stdout, stderr } = await runCLI({
      args: [
        "run",
        "-m",
        "./polywrap.test.validate.yaml",
        "-c",
        "./client-config.ts",
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
        "-m",
        "polywrap.test.invalid.json",
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
