import { composeSchema } from "../";
import { fetchTestCases } from "./cases";

describe("Web3API Schema Composer Test Cases", () => {
  const cases = fetchTestCases();

  for (const test of cases) {

    it(`Case: ${test.name}`, () => {
      const result = composeSchema(test.input);
      expect(result).toMatchObject(test.output);
    });
  }
});

// TODO: make sure importing a dependencies dependency works
