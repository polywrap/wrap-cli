import { composeSchema, renderSchema } from "..";
import { fetchTestCases } from "./index";

import { diff } from "jest-diff";

function sanitizeObj(obj: unknown) {
  if (typeof obj !== "object") {
    return;
  }

  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;

    const prop = (obj as any)[i];
    const typeOf = typeof prop;

    if (typeOf === "object") {
      sanitizeObj(prop);
    } else if (typeOf === "function") {
      delete (obj as any)[i];
    } else if (typeOf === "undefined") {
      delete (obj as any)[i];
    }
  }

  return obj;
}

describe("Polywrap Schema Composer Test Cases", () => {
  let cases = fetchTestCases();
  for (const test of cases) {
    it(`Case: ${test.name}`, async () => {
      const testCase = await test.promise;

      if (!testCase) {
        return;
      }

      const result = await composeSchema(testCase.input);

      // Check result with output ABI
      sanitizeObj(result);
      sanitizeObj(testCase.abi);
      expect(result).toMatchObject(testCase.abi);

      // Check rendered result schema with output schema
      const resultSchema = renderSchema(result, true);

      if (testCase.schema) {
        expect(diff(testCase.schema, resultSchema))
          .toContain("Compared values have no visual difference");
      }

      // Check rendering between result ABI and output ABI
      const testCaseSchema = renderSchema(testCase.abi, true);
      expect(diff(testCaseSchema, resultSchema))
        .toContain("Compared values have no visual difference");
    });
  }
});
