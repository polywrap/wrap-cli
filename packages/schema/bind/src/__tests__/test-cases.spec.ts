import { fetchTestCases } from "./index";
import { readDirectory } from "../bindings/utils/fs";
import { alphabeticalNamedSort } from "../bindings/utils/sort";
import {
  bindSchema,
  OutputEntry,
  BindLanguage,
  BindOptions,
  BindOutput
} from "../";

import { writeFileSync } from "@web3api/os-js";

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

        if (language !== "wasm-as") {
          continue;
        }

        // Read the expected output directories
        const expectedModuleWiseOutput: BindOutput = {
          modules: []
        };
        const expectedCombinedOutput: BindOutput = {
          modules: []
        };

        if (directories.query) {
          expectedModuleWiseOutput.modules.push({
            name: "query",
            output: readDirectory(directories.query)
          });
        }

        if (directories.mutation) {
          expectedModuleWiseOutput.modules.push({
            name: "mutation",
            output: readDirectory(directories.mutation)
          });
        }

        if (directories.common) {
          expectedModuleWiseOutput.common = {
            name: "common",
            output: readDirectory(directories.common)
          };
        }

        if (directories.combined) {
          expectedCombinedOutput.modules.push({
            name: "combined",
            output: readDirectory(directories.combined)
          });
        }

        const moduleWiseOptions: BindOptions = {
          bindLanguage: language as BindLanguage,
          modules,
          commonDirAbs: directories.common ? commonDirAbs : undefined
        };
        const combinedOptions: BindOptions | undefined = directories.combined ? {
          bindLanguage: language as BindLanguage,
          modules: [testCase.input.combined]
        } : undefined;

        const moduleWiseOutput = bindSchema(moduleWiseOptions);
        const combinedOutput = combinedOptions ? bindSchema(combinedOptions) : undefined;

        const validateOutput = (output: BindOutput, expected: BindOutput, tag?: string) => {
          const sort = (array: OutputEntry[]): OutputEntry[] => {
            array.forEach((entry) => {
              if (typeof entry.data !== "string") entry.data = sort(entry.data);
            });

            return array.sort(alphabeticalNamedSort);
          };

          for (const module of output.modules) {
            module.output.entries = sort(module.output.entries);
          }

          if (output.common) {
            output.common.output.entries = sort(output.common.output.entries);
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

        validateOutput(moduleWiseOutput, expectedModuleWiseOutput);
        combinedOutput && validateOutput(combinedOutput, expectedCombinedOutput, "combined");
      }
    });
  }
});
