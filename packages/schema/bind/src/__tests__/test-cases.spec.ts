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
} from "@polywrap/os-js";

import fs from "fs";
import path from "path";

describe("Polywrap Binding Test Suite", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, async () => {
      console.log(">", test.name)
      const testCase = await test.promise;

      if (!testCase) {
        return;
      }

      // For each language
      for (const outputLanguage of testCase.outputLanguages) {
        // Verify it binds correctly
        const { language, directory } = outputLanguage;

        console.log(">>", language)

        // Read the expected output directories
        let expectedOutput: BindOutput = {
          output: readDirectorySync(directory),
          outputDirAbs: testCase.input.outputDirAbs,
        };

        const output = bindSchema({
          ...testCase.input,
          bindLanguage: language as BindLanguage,
        });

        const sort = (array: OutputEntry[]): OutputEntry[] => {
          array.forEach((entry) => {
            if (typeof entry.data !== "string") entry.data = sort(entry.data);
          });

          return array.sort(alphabeticalNamedSort);
        };

        output.output.entries = sort(output.output.entries);
        expectedOutput.output.entries = sort(expectedOutput.output.entries);

        const testResultDir = path.join(__dirname, "/test-results/");

        if (!fs.existsSync(testResultDir)) {
          fs.mkdirSync(testResultDir);
        }

        writeFileSync(
          path.join(
            testResultDir,
            `${language}-output.json`
          ),
          JSON.stringify(output, null, 2),
        );
        writeFileSync(
          path.join(
            testResultDir,
            `${language}-expected.json`
          ),
          JSON.stringify(expectedOutput, null, 2),
        );

        expect(output).toMatchObject(expectedOutput);
      }
    });
  }
});
