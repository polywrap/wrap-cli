import { fetchTestCases } from "./utils";
import { loadDirectory } from "../utils/fs";
import { generateCode, buildSchema, TargetLanguage } from "../";

describe("Web3API Binding Test Suite", () => {

  const cases = fetchTestCases();

  for (const test of cases) {

    describe(`Case: ${test.name}`, () => {

      // Given an input schema
      const schema = buildSchema(test.inputSchema);

      // For each language
      for (const outputLanguage of test.outputLanguages) {

        // Verify it binds correctly
        it(`Binds: ${outputLanguage.name}`, () => {
          const { name, directory } = outputLanguage;
          const expectedOutput = loadDirectory(directory);
          const output = generateCode(name as TargetLanguage, schema);

          const alphabetical = (a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
          }

          output.entries = output.entries.sort(alphabetical);

          expect(output).toMatchObject(expectedOutput);
        });
      }
    });
  }
});
