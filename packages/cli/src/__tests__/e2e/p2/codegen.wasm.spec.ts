import { Commands } from "@polywrap/cli-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";

import { polywrapCli } from "../utils";
import { testCliOutput } from "../helpers/testCliOutput";
import { testCodegenOutput } from "../helpers/testCodegenOutput";
import { CodegenCommandOptions } from "../../../commands";

describe("e2e tests for codegen command - wasm/interface project", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "codegen/wasm");
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
      let args: CodegenCommandOptions;
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig) {
          args = cmdConfig;
        }

        if (cmdConfig.codegenDir) {
          codegenDir = path.join(testCaseDir, cmdConfig.codegenDir);
        }
      }

      test(testCaseName, async () => {
        let { exitCode, stdout, stderr } = await Commands.codegen(args, {
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        testCliOutput(testCaseDir, exitCode, stdout, stderr);
        testCodegenOutput(testCaseDir, codegenDir);
      });
    }
  });
});
