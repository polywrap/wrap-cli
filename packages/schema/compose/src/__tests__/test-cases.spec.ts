import { composeSchema } from "../";
import { fetchTestCases } from "./cases";

describe("Web3API Schema Composer Test Cases", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, async () => {
      const result = await composeSchema(test.input);
      expect(result).toMatchObject(test.output);
    });
  }
});
