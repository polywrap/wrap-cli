import { polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import { testCliOutput } from "./helpers/testCliOutput";
import { testCodegenOutput } from "./helpers/testCodegenOutput";
import { CodegenManifest, deserializeCodegenManifest } from "@polywrap/polywrap-manifest-types-js";

describe("e2e tests for codegen command - app project", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "app", "codegen");
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

      // retrieve codegen manifest
      let codegenManifest: CodegenManifest | undefined;
      const codegenManifestPath = path.join(testCaseDir, "polywrap.codegen.yaml");
      if (fs.existsSync(codegenManifestPath)) {
        const codegenManifestStr = fs.readFileSync(codegenManifestPath, "utf-8");
        codegenManifest = deserializeCodegenManifest(codegenManifestStr)
      }

      let codegenDir = codegenManifest?.codegenDir
        ? path.join(testCaseDir, codegenManifest?.codegenDir)
        : path.join(testCaseDir, "src", "wrap");

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
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["codegen", ...cmdArgs],
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        testCliOutput(testCaseDir, code, output, error);
        testCodegenOutput(testCaseDir, codegenDir);
      });
    }
  });
});
