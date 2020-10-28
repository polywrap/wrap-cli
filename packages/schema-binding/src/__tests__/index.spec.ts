import { fetchTestCases, fetchOutputDirectory } from "./utils";
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
          const expectedOutput = fetchOutputDirectory(directory);
          const output = generateCode(name as TargetLanguage, schema);

          expect(output).toMatchObject(expectedOutput);
        });
      }
    });
  }
});
