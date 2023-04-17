import { polywrapCli } from "../utils";
import { testCliOutput } from "../helpers/testCliOutput";
import { testCodegenOutput } from "../helpers/testCodegenOutput";
import { CodegenCommandOptions } from "../../../commands";

import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { Commands } from "@polywrap/cli-js";
import path from "path";
import fs from "fs";

describe("e2e tests for codegen command - app project", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "codegen/app");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      let args: CodegenCommandOptions;
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig) {
          args = cmdConfig;
        }
      }

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await Commands.codegen(args, {
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
