import { clearStyle, polywrapCli } from "../utils";
import { testBuildOutput } from "../helpers/testBuildOutput";
import { BuildCommandOptions } from "../../../commands";

import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { Commands } from "@polywrap/cli-js";
import fs from "fs";
import path from "path";

jest.setTimeout(500000);

describe("e2e tests for interface build command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "build-cmd/interface");
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

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; i++) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      let args: BuildCommandOptions;
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig) {
          args = cmdConfig;
        }
      }

      test(testCaseName, async () => {
        const { exitCode, stdout, stderr } = await Commands.build({
          ...args,
          verbose: true
        }, {
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        const buildDir = path.join(testCaseDir, "build");

        testCliOutput(testCaseDir, exitCode, stdout, stderr);
        testBuildOutput(testCaseDir, buildDir);
      });
    }
  });
});
