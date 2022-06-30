import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { compareSync } from "dir-compare";
import path from "path";
import fs from "fs";

const HELP = `Usage: polywrap plugin|p [options] [command]

Build/generate types for the plugin

Options:
  -h, --help         display help for command

Commands:
  codegen [options]
  help [command]     display help for command
`;

describe("e2e tests for plugin command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "plugin/codegen");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
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

  const testCodegenOutput = (testCaseDir: string, codegenDir: string, buildDir: string) => {
    if (fs.existsSync(path.join(testCaseDir, "expected", "wrap"))) {
      const expectedCodegenResult = compareSync(
        codegenDir,
        path.join(testCaseDir, "expected", "wrap"),
        { compareContent: true }
      );
      console.log(expectedCodegenResult);
      expect(expectedCodegenResult.differences).toBe(0);
    }

    if (fs.existsSync(path.join(testCaseDir, "expected", "build-artifacts"))) {
      const expectedBuildResult = compareSync(
        buildDir,
        path.join(testCaseDir, "expected", "build-artifacts"),
        { compareContent: true }
      );
      expect(expectedBuildResult.differences).toBe(0);
    }
  };

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "--help"],
        cwd: getTestCaseDir(0),
      }
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - no command", async () => {
    const { exitCode: code, stderr: error, stdout: output } = await runCLI(
      {
        args: ["plugin", "--codegen-dir"],
        cwd: getTestCaseDir(0),
      }
    );

    expect(code).toEqual(1);
    expect(error).toContain("error: unknown option '--codegen-dir'");
    expect(output).toBe("");
  });

  describe("missing option arguments", () => {
    const missingOptionArgs = {
      "--manifest-file": "-m, --manifest-file <path>",
      "--publish-dir": "-p, --publish-dir <path>",
      "--codegen-dir": "-g, --codegen-dir <path>",
      "--client-config": "-c, --client-config <config-path>"
    };

    for (const [option, errorMessage] of Object.entries(missingOptionArgs)) {
      it(`Should throw error if params not specified for ${option} option`, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["plugin", "codegen", option],
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

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      let codegenDir = path.join(testCaseDir, "src", "wrap");
      let buildDir = path.join(testCaseDir, "build");
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

        if(cmdConfig.buildDir) {
          buildDir = path.join(testCaseDir, cmdConfig.buildDir);
        }
      }

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI(
          {
            args: ["plugin", "codegen", ...cmdArgs],
            cwd: testCaseDir,
          }
        );

        testCliOutput(testCaseDir, code, output, error);
        testCodegenOutput(testCaseDir, codegenDir, buildDir);
      });
    }
  });
});
