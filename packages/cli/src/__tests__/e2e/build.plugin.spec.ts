import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import { testCliOutput } from "./helpers/testCliOutput";
import { testBuildOutput } from "./helpers/testBuildOutput";

describe("e2e tests for build command - plugin project", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "plugin/build-cmd");
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

      let buildDir = path.join(testCaseDir, "build");
      let cmdArgs: string[] = [];
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig.args) {
          cmdArgs.push(...cmdConfig.args);
        }

        if (cmdConfig.buildDir) {
          buildDir = path.join(testCaseDir, cmdConfig.buildDir);
        }
      }

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["build", ...cmdArgs],
          cwd: testCaseDir,
        });

        testCliOutput(testCaseDir, code, output, error);
        testBuildOutput(testCaseDir, buildDir);
      });
    }
  });
});
