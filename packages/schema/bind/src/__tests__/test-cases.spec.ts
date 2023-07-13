import { fetchTestCases } from "./index";
import {
  bindSchema,
  BindLanguage,
  BindOutput,
  bindLanguageToWrapInfoType,
  BindOptions
} from "../";

import {
  readDirectorySync,
  writeFileSync,
  alphabeticalNamedSort,
  OutputEntry
} from "@polywrap/os-js";

import fs, {existsSync, mkdirSync} from "fs";
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

        const bindOptions: BindOptions = {
          ...deepCopy(testCase.input),
          wrapInfo: {
            ...deepCopy(testCase.input.wrapInfo),
            type: bindLanguageToWrapInfoType(language as BindLanguage)
          },
          bindLanguage: language as BindLanguage,
        };

        if (language == "wasm-go") {
          if (!bindOptions.config) {
            bindOptions.config = {};
          }
          bindOptions.config.goModuleName = "github.com/testorg/testrepo";
        }

        const output = await bindSchema(bindOptions);

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

        const paths: string[] = [];


        const outputDirectoryEntry = (root: string, entry: OutputEntry) => {
          const entryPath = path.join(root, entry.name);
          paths.push(entryPath);

          switch (entry.type) {
            case "File": {
              writeFileSync(entryPath, entry.data);
              break;
            }
            case "Directory": {
              for (const subEntry of entry.data) {
                if (!existsSync(entryPath)) {
                  mkdirSync(entryPath, { recursive: true });
                }
                outputDirectoryEntry(entryPath, subEntry);
              }
              break;
            }
            default: {
              throw Error(
                  `outputDirectoryEntry: Unknown entry type. Entry: ${JSON.stringify(
                      entry
                  )}`
              );
            }
          }
        };

        for (const entry of output.output.entries) {
          outputDirectoryEntry(testResultDir, entry);
        }


        expect(output).toMatchObject(expectedOutput);
      }
    });
  }
});
