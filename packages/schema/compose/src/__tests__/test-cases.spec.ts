import { composeSchema } from "../";
import { fetchTestCases } from "./index";

describe("Web3API Schema Composer Test Cases", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, async () => {
      const result = await composeSchema(test.input);
      if (test.output.query) {
        expect(result.query).toEqual(test.output.query);
      }
      if (test.output.mutation) {
        expect(result.mutation).toEqual(test.output.mutation);
      }
      if (test.output.combined) {
        expect(result.combined).toEqual(test.output.combined);
      }
    });
  }
});
