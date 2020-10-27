import { fetchTestCases, fetchOutputDirectory } from "./utils";
import { buildSchema, generateCode } from "../";

describe("Web3API Binding Test Suite", () => {

  const cases = fetchTestCases();

  for (const test of cases) {

    describe(`Case: ${test.name}`, () => {

      // Given an input schema
      const schema = buildSchema(test.inputSchema);

      // For each language
      for (const outputLanguage of test.outputLanguages) {

        // Verify it binds correctly
        it(`Binds: ${outputLanguage}`, () => {
          const { name, directory } = outputLanguage;
          const expectedOutput = fetchOutputDirectory(directory);
          const output = generateBindings(outputLanguage, schema);

          expect(output).toMatchObject(expectedOutput);
        });
      }
    });
  }
});
