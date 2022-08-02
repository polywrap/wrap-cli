import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import os from "os";
import rimraf from "rimraf";
import { compareSync } from "dir-compare";

const HELP = `Usage: polywrap app|a [options] [command]

Build/generate types for your app

Options:
  -h, --help         display help for command

Commands:
  codegen [options]  Generate code for the app
  help [command]     display help for command
`;

const CODEGEN_SUCCESS = `- Manifest loaded from ./polywrap.app.yaml
✔ Manifest loaded from ./polywrap.app.yaml
- Generate types
✔ Generate types
🔥 Code was generated successfully 🔥
`;

describe("e2e tests for app command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "app", "codegen");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  const testCliOutput = (
    testCaseDir: string,
    exitCode: number,
    stdout: string,
    stder: string
  ) => {
    const output = clearStyle(stdout);
    const error = clearStyle(stder);

    const expected = JSON.parse(
      fs.readFileSync(
        path.join(testCaseDir, "expected", "stdout.json"),
        "utf-8"
      )
    );

    if (expected.stdout) {
      if (Array.isArray(expected.stdout)) {
        for (const line of expected.stdout) {
          expect(output).toContain(line);
        }
      } else {
        expect(output).toContain(expected.stdout);
      }
    }

    if (expected.stderr) {
      if (Array.isArray(expected.stderr)) {
        for (const line of expected.stderr) {
          expect(error).toContain(line);
        }
      } else {
        expect(error).toContain(expected.stderr);
      }
    }

    if (expected.exitCode) {
      expect(exitCode).toEqual(expected.exitCode);
    }

    if (expected.files) {
      for (const file of expected.files) {
        expect(fs.existsSync(path.join(testCaseDir, file))).toBeTruthy();
      }
    }
  };

  const testCodegenOutput = (testCaseDir: string, codegenDir: string) => {
    if (fs.existsSync(path.join(testCaseDir, "expected", "wrap"))) {
      const expectedTypesResult = compareSync(
        codegenDir,
        path.join(testCaseDir, "expected", "wrap"),
        { compareContent: true }
      );
      expect(expectedTypesResult.differences).toBe(0);
    }
  };

  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "--help"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should show help for no command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe(HELP);
    expect(output).toBe("");
  });

  it("Should throw error for invalid command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "invalid"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("error: unknown command 'invalid'\n");
    expect(output).toEqual(``);
  });

  it("Should throw error for unknown option --output-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "--output-dir"],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe("error: unknown option '--output-dir'\n");
    expect(output).toEqual(``);
  });

  describe("missing option arguments", () => {
    const missingOptionArgs = {
      "--manifest-file": "-m, --manifest-file <path>",
      "--codegen-dir": "-g, --codegen-dir <path>",
      "--client-config": "-c, --client-config <config-path>"
    }

    for (const [option, errorMessage] of Object.entries(missingOptionArgs)) {
      it(`Should throw error if params not specified for ${option} option`, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["app", "codegen", option],
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

  it("Should store generated files to specified codegen dir", async () => {
    const testCaseDir = getTestCaseDir(0);
    const codegenDir = fs.mkdtempSync(
      path.join(os.tmpdir(), `polywrap-cli-tests`)
    );
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["app", "codegen", "--codegen-dir", codegenDir],
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS);

    testCodegenOutput(testCaseDir, codegenDir);

    rimraf.sync(codegenDir);
  });

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);
      
      let cmdArgs: string[] = [];
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig.args) {
          cmdArgs.push(...cmdConfig.args);
        }
      }

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["app", "codegen", ...cmdArgs],
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        const codegenDir = path.resolve(testCaseDir, "src", "wrap");

        testCliOutput(testCaseDir, code, output, error);
        testCodegenOutput(testCaseDir, codegenDir);
      });
    }
  });
});
