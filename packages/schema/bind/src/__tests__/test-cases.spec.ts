import { fetchTestCases } from "./index";
import {
  bindSchema,
  BindLanguage,
  BindOutput, bindLanguageToWrapInfoType,
} from "../";

import {
  readDirectorySync,
  writeFileSync,
  alphabeticalNamedSort,
  OutputEntry
} from "@polywrap/os-js";

import fs from "fs";
import path from "path";

import { deepCopy } from "./utils";

jest.setTimeout(60000);

describe("Polywrap Binding Test Suite", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, async () => {
      const testCase = await test.promise;

      if (!testCase) {
        return;
      }

      // For each language
      for (const outputLanguage of testCase.outputLanguages) {
        // Verify it binds correctly
        const { language, directory } = outputLanguage;

        // Read the expected output directories
        let expectedOutput: BindOutput = {
          output: readDirectorySync(directory),
          outputDirAbs: testCase.input.outputDirAbs,
        };

        const output = await bindSchema({
          ...deepCopy(testCase.input),
          wrapInfo: {
            ...deepCopy(testCase.input.wrapInfo),
            type: bindLanguageToWrapInfoType(language as BindLanguage)
          },
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
