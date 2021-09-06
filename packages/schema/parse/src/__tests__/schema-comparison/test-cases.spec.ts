import { compare } from "../../schema-comparison";
import { fetchTestCases } from "./index";

describe("Web3API Version Comparison Test Cases", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, () => {
      const result = compare(test.input1, test.input2);
      expect(result).toBe(test.output);
    });
  }
});
