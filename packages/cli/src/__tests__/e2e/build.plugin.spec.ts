import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { Commands } from "@polywrap/cli-js";
import path from "path";
import fs from "fs";
import { testCliOutput } from "./helpers/testCliOutput";
import { testBuildOutput } from "./helpers/testBuildOutput";
import { BuildCommandOptions } from "../../commands";

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
      let cmdFile = path.join(testCaseDir, "cmd.json");
      let args: BuildCommandOptions;
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        args = cmdConfig;

        if (args.buildDir) {
          buildDir = path.join(testCaseDir, cmdConfig.buildDir);
        }
      }

      test(testCaseName, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await Commands.build({
          ...args,
        }, {
          cwd: testCaseDir,
        });
        testCliOutput(testCaseDir, code, output, error);
        testBuildOutput(testCaseDir, buildDir);
      });
    }
  });
});
