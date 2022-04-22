import { fetchTestCases } from "./index";
import {
  bindSchema,
  BindLanguage,
  BindOutput
} from "../";

import {
  readDirectorySync,
  writeFileSync,
  alphabeticalNamedSort,
  OutputEntry
} from "@web3api/os-js";

import fs from "fs";
import path from "path";

describe("Web3API Binding Test Suite", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, async () => {
      const testCase = await test.promise;

      if (!testCase) {
        return;
      }

      const commonDirAbs = testCase.input.commonDirAbs;
      const modules = testCase.input.modules;

      // For each language
      for (const outputLanguage of testCase.outputLanguages) {
        // Verify it binds correctly
        const { language, directories } = outputLanguage;

        // Read the expected output directories
        let expectedModuleWiseOutput: BindOutput | undefined;
        let expectedCombinedOutput: BindOutput | undefined;

        if (directories.moduleWise) {
          expectedModuleWiseOutput = {
            modules: []
          };

          for (const moduleName of Object.keys(directories.moduleWise)) {
            if (moduleName === "common") {
              expectedModuleWiseOutput.common = {
                name: moduleName,
                output: readDirectorySync(
                  directories.moduleWise[moduleName]
                ),
                outputDirAbs: testCase.input.commonDirAbs
              };
            } else {
              expectedModuleWiseOutput.modules.push({
                name: moduleName,
                output: readDirectorySync(
                  directories.moduleWise[moduleName]
                ),
                outputDirAbs: testCase.input.modules.find(
                  (module) => module.name === moduleName
                )?.outputDirAbs || "",
              });
            }
          }
        }

        if (directories.combined) {
          expectedCombinedOutput = {
            modules: []
          };
          expectedCombinedOutput.modules.push({
            name: "combined",
            output: readDirectorySync(directories.combined),
            outputDirAbs: testCase.input.combined.outputDirAbs,
          });
        }

        const hasCommonModule = Object.keys(directories.moduleWise || {})
          .indexOf("common") > -1;
        const moduleWiseOutput = expectedModuleWiseOutput
          ? bindSchema({
            projectName: "TestCase",
            bindLanguage: language as BindLanguage,
            modules,
            commonDirAbs: hasCommonModule ? commonDirAbs : undefined
          })
          : undefined;

        const combinedOutput = expectedCombinedOutput
          ? bindSchema({
            projectName: "TestCase",
            bindLanguage: language as BindLanguage,
            modules: [testCase.input.combined]
          })
          : undefined;

        const validateOutput = (output: BindOutput, expected: BindOutput, tag?: string) => {
          const sort = (array: OutputEntry[]): OutputEntry[] => {
            array.forEach((entry) => {
              if (typeof entry.data !== "string") entry.data = sort(entry.data);
            });

            return array.sort(alphabeticalNamedSort);
          };

          output.modules = output.modules.sort(alphabeticalNamedSort);
          expected.modules = expected.modules.sort(alphabeticalNamedSort);

          for (const module of output.modules) {
            module.output.entries = sort(module.output.entries);
          }
          for (const module of expected.modules) {
            module.output.entries = sort(module.output.entries);
          }

          if (output.common) {
            output.common.output.entries = sort(output.common.output.entries);
          }
          if (expected.common) {
            expected.common.output.entries = sort(expected.common.output.entries);
          }

          const testResultDir = path.join(__dirname, "/test-results/");

          if (!fs.existsSync(testResultDir)) {
            fs.mkdirSync(testResultDir);
          }

          writeFileSync(
            path.join(
              testResultDir,
              tag ?
              `${language}-${tag}-output.json` :
              `${language}-output.json`
            ),
            JSON.stringify(output, null, 2),
          );
          writeFileSync(
            path.join(
              testResultDir,
              tag ?
              `${language}-${tag}-expected.json` :
              `${language}-expected.json`
            ),
            JSON.stringify(expected, null, 2),
          );

          expect(output).toMatchObject(expected);
        }

        if (expectedModuleWiseOutput && moduleWiseOutput) {
          validateOutput(moduleWiseOutput, expectedModuleWiseOutput);
        }

        if (expectedCombinedOutput && combinedOutput) {
          validateOutput(combinedOutput, expectedCombinedOutput, "combined");
        }
      }
    });
  }
});
