import { parseSchema } from "../";
import { fetchTestCases } from "./index";

describe("Web3API Schema Parser Test Cases", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, () => {
      const result = parseSchema(test.input);
      expect(result).toMatchObject(test.output);
    });
  }
});
