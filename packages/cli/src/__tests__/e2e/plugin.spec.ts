import { clearStyle } from "./utils";

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

const CODEGEN_SUCCESS = `- Manifest loaded from ./polywrap.plugin.yaml
✔ Manifest loaded from ./polywrap.plugin.yaml
- Generate types
✔ Generate types
- Manifest written to ./build/polywrap.plugin.json
✔ Manifest written to ./build/polywrap.plugin.json
`;

describe("e2e tests for plugin command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "plugin/codegen");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

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

  test("Should throw error for invalid params - publish-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "codegen", "--publish-dir"],
        cwd: getTestCaseDir(0),
      }
    );

    expect(code).toEqual(1);
    expect(error).toContain("error: option '-p, --publish-dir <path>' argument missing");
    expect(output).toBe("");
  });

  test("Should throw error for invalid params - codegen-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["plugin", "codegen", "--codegen-dir"],
        cwd: getTestCaseDir(0),
      }
    );

    expect(code).toEqual(1);
    expect(error).toContain("error: option '-g, --codegen-dir <path>' argument missing");
    expect(output).toBe("");
  });

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI(
          {
            args: ["plugin", "codegen"],
            cwd: testCaseDir,
          }
        );

        expect(error).toBe("");
        expect(code).toEqual(0);
        expect(clearStyle(output)).toEqual(CODEGEN_SUCCESS);

        const expectedTypesResult = compareSync(
          `${testCaseDir}/src/wrap`,
          `${testCaseDir}/expected/src/wrap`,
          { compareContent: true }
        );
        expect(expectedTypesResult.differences).toBe(0);

        const expectedBuildResult = compareSync(
          `${testCaseDir}/build`,
          `${testCaseDir}/expected/build-artifacts`,
          { compareContent: true }
        );

        expect(expectedBuildResult.differences).toBe(0);
      });
    }
  });
});
