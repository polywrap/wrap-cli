import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import os from "os";
import rimraf from "rimraf";

const HELP = `Usage: polywrap codegen|g [options]

Generate Code For Polywrap Projects

Options:
  -m, --manifest-file <path>         Path to the Polywrap manifest file
                                     (default: polywrap.yaml | polywrap.yml |
                                     polywrap.app.yaml | polywrap.app.yml |
                                     polywrap.plugin.yaml |
                                     polywrap.plugin.yml)
  -g, --codegen-dir <path>            Output directory for the generated code
                                     (default: ./src/wrap)
  -p, --publish-dir <path>           Output path for the built schema and
                                     manifest (default: ./build)
  -s, --script <path>                Path to a custom generation script
                                     (JavaScript | TypeScript)
  -c, --client-config <config-path>  Add custom configuration to the
                                     PolywrapClient
  -h, --help                         display help for command
`;

describe("e2e tests for codegen command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/codegen");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--help"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should throw error for unknown option --invalid", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--invalid"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("error: unknown option '--invalid'\n");
    expect(output).toEqual(``);
  });

  describe("missing option arguments", () => {
    const missingOptionArgs = {
      "--manifest-file": "-m, --manifest-file <path>",
      "--codegen-dir": "-g, --codegen-dir <path>",
      "--client-config": "-c, --client-config <config-path>",
      "--script": "-s, --script <path>",
    };

    for (const [option, errorMessage] of Object.entries(missingOptionArgs)) {
      it(`Should throw error if params not specified for ${option} option`, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["codegen", option],
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

  it("Should throw error for invalid generation file - wrong file", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--script", `polywrap-invalid.gen.js`],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    const genFile = path.normalize(
      `${getTestCaseDir(0)}/polywrap-invalid.gen.js`
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(
      `Failed to generate types: Cannot find module '${genFile}'`
    );
  });

  it("Should throw error for invalid generation file - no run() method", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--script", `polywrap-norun.gen.js`],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(
      `Failed to generate types: The generation file provided doesn't have the 'generateBinding' method.`
    );
  });

  it("Should store build files in specified codegen dir", async () => {
    const codegenDir = fs.mkdtempSync(
      path.join(os.tmpdir(), `polywrap-cli-tests`)
    );
    const testCaseDir = getTestCaseDir(0);
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen", "--codegen-dir", codegenDir],
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toContain(
      `🔥 Types were generated successfully 🔥`
    );
  });

  it("Should successfully generate types", async () => {
    rimraf.sync(`${getTestCaseDir(0)}/types`);

    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(
      `🔥 Types were generated successfully 🔥`
    );

    rimraf.sync(`${getTestCaseDir(0)}/types`);
  });

  it("Should successfully generate types - Rust", async () => {
    rimraf.sync(`${getTestCaseDir(1)}/types`);

    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["codegen"],
      cwd: getTestCaseDir(1),
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(
      `🔥 Types were generated successfully 🔥`
    );

    rimraf.sync(`${getTestCaseDir(1)}/types`);
  });
});
