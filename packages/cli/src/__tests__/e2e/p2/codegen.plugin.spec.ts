import { testCliOutput } from "../helpers/testCliOutput";
import { testCodegenOutput } from "../helpers/testCodegenOutput";
import { CodegenCommandOptions } from "../../../commands";
import {
  defaultProjectManifestFiles,
  parseManifestFileOption,
  PluginProject,
  Logger
} from "../../../lib";

import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { Commands } from "@polywrap/cli-js";

import path from "path";
import fs from "fs";

describe("e2e tests for codegen command - plugin project", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "codegen/plugin");
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

      test(testCaseName, async () => {
        // Default codegen dir
        let codegenDir: string | undefined;

        // Load custom cmd args from cmd.json
        let args: CodegenCommandOptions | undefined;
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

        // Load the project, and see if we get a different codegen dir
        if (!codegenDir) {
          const manifestFile = parseManifestFileOption(
            args?.manifestFile ? path.join(testCaseDir, args?.manifestFile) : false,
            defaultProjectManifestFiles.map((x) => path.join(testCaseDir, x))
          );
          const project = new PluginProject({
            rootDir: path.dirname(manifestFile),
            pluginManifestPath: manifestFile,
            logger: new Logger({}),
          });
          codegenDir = await project.getGenerationDirectory();
        }

        const { exitCode: code, stdout: output, stderr: error } = await Commands.codegen(args, {
          cwd: testCaseDir,
        });
        testCliOutput(testCaseDir, code, output, error);
        testCodegenOutput(testCaseDir, codegenDir as string);
      });
    }
  });
});
