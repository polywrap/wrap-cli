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
        const expectedOutput: BindOutput = {
          modules: []
        };

        if (directories.query) {
          expectedOutput.modules.push({
            name: "query",
            output: readDirectory(directories.query)
          });
        }

        if (directories.mutation) {
          expectedOutput.modules.push({
            name: "mutation",
            output: readDirectory(directories.mutation)
          });
        }

        if (directories.combined) {
          expectedOutput.modules.push({
            name: "combined",
            output: readDirectory(directories.combined)
          });
        }

        if (directories.common) {
          expectedOutput.common = {
            name: "common",
            output: readDirectory(directories.common)
          };
        }

        const options: BindOptions = {
          bindLanguage: language as BindLanguage,
          modules,
          commonDirAbs: directories.common ? commonDirAbs : undefined
        }

        const output = bindSchema(options);

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
          path.join(testResultDir, `${language}-output.json`),
          JSON.stringify(output, null, 2),
        );
        writeFileSync(
          path.join(testResultDir, `${language}-expected.json`),
          JSON.stringify(expectedOutput, null, 2),
        );

        expect(output).toMatchObject(expectedOutput);
      }
    });
  }
});
