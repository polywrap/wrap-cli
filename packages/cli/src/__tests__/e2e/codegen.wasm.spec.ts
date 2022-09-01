import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import { compareSync } from "dir-compare";

describe("e2e tests for codegen command - wasm", () => {
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

        if (cmdConfig.codegenDir) {
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
