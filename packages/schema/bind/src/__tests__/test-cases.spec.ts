import { fetchTestCases } from "./index";
import { readDirectory } from "../utils/fs";
import { alphabeticalNamedSort } from "../utils/sort";
import { bindSchema, OutputEntry, TargetLanguage } from "../";

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

      // For each language
      for (const outputLanguage of testCase.outputLanguages) {
        // Verify it binds correctly
        const { language, directories } = outputLanguage;

        // Read the expected output directories
        const expectedOutput = {
          query: directories.query
            ? readDirectory(directories.query)
            : undefined,
          mutation: directories.mutation
            ? readDirectory(directories.mutation)
            : undefined,
          combined: directories.combined
            ? readDirectory(directories.combined)
            : undefined,
        };

        const output = bindSchema({
          language: language as TargetLanguage,
          query: expectedOutput.query ? testCase.input.query : undefined,
          mutation: expectedOutput.mutation ? testCase.input.mutation : undefined,
          combined: expectedOutput.combined ? testCase.input.combined : undefined,
        });

        const sort = (array: OutputEntry[]): OutputEntry[] => {
          array.forEach((entry) => {
            if (typeof entry.data !== "string") entry.data = sort(entry.data);
          });

          return array.sort(alphabeticalNamedSort);
        };

        if (output.query) {
          output.query.entries = sort(output.query.entries);
        }

        if (output.mutation) {
          output.mutation.entries = sort(output.mutation.entries);
        }

        if (output.combined) {
          output.combined.entries = sort(output.combined.entries);
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
