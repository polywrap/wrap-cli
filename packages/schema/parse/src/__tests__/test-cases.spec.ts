import { parseSchema } from "../";
import { fetchTestCases } from "./index";

describe("Polywrap Schema Parser Test Cases", () => {
  const cases = fetchTestCases();

  for (const test of cases) {
    it(`Case: ${test.name}`, async () => {
      const testCase = await test.promise;

      if (!testCase) {
        return;
      }

      const result = parseSchema(testCase.input);
      expect(result).toMatchObject(testCase.output);
    });
  }
});
