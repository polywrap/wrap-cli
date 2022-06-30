import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import rimraf from "rimraf";

const HELP = `Usage: polywrap codegen|g [options]

Auto-generate Wrapper Types

Options:
  -m, --manifest-file <path>         Path to the Polywrap manifest file
                                     (default: polywrap.yaml | polywrap.yml)
  -g, --codegen-dir <path>            Output directory for the generated code
                                     (default: ./wrap)
  -s, --script <path>                Path to a custom generation script
                                     (JavaScript | TypeScript)
  -c, --client-config <config-path>  Add custom configuration to the
                                     PolywrapClient
  -h, --help                         display help for command
`;

type Directory = {
  name: string;
  files: string[];
  directories: Directory[];
}

describe("e2e tests for codegen command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/codegen");
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

  const testGeneratedDir = (currentDir: string, expectedDir: Directory) => {
    for (const file of expectedDir.files) {
      expect(fs.existsSync(path.join(currentDir, file))).toBeTruthy();
    }
    for (const subdir of expectedDir.directories) {
      testGeneratedDir(path.join(currentDir, subdir.name), subdir)
    }
  }

  const testCodegenOutput = (testCaseDir: string, codegenDir: string) => {
    const expectedOutputFile = path.join(
      testCaseDir,
      "expected",
      "output.json"
    );
    if (fs.existsSync(expectedOutputFile)) {
      const expectedDir: Directory = JSON.parse(
        fs.readFileSync(expectedOutputFile, { encoding: "utf8" })
      );

      testGeneratedDir(codegenDir, expectedDir);
    }
  };

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
    const codegenDir = path.resolve(
      process.env.TMPDIR || "/tmp",
      `codegen-${Date.now()}`
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

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);
      let codegenDir = path.join(testCaseDir, "src", "wrap");
      let cmdArgs: string[] = [];
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig.args) {
          cmdArgs.push(...cmdConfig.args);
        }

        if(cmdConfig.codegenDir) {
          codegenDir = path.join(testCaseDir, cmdConfig.codegenDir);
        }
      }

      test(testCaseName, async () => {
        let { exitCode, stdout, stderr } = await runCLI({
          args: ["codegen", ...cmdArgs],
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        testCliOutput(testCaseDir, exitCode, stdout, stderr);
        testCodegenOutput(testCaseDir, codegenDir);
      });
    }
  });
});
