import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import { testCliOutput } from "./helpers/testCliOutput";
import { testCodegenOutput } from "./helpers/testCodegenOutput";
import {Commands} from "@polywrap/cli-js";

describe("e2e tests for codegen command - plugin project", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "plugin/codegen");
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
        const { exitCode: code, stdout: output, stderr: error } = await Commands.codegen({
          args: ["codegen", ...cmdArgs],
          cwd: testCaseDir,
        });
        testCliOutput(testCaseDir, code, output, error);
        testCodegenOutput(testCaseDir, codegenDir);
      });
    }
  });
});
