import { composeSchema } from "../";
import { fetchTestCases } from "./index";

function removeFunctionProps(obj: unknown) {
  if (typeof obj !== "object") {
    return;
  }

  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;

    const typeOf = typeof (obj as any)[i];

    if (typeOf === "object") {
      removeFunctionProps((obj as any)[i]);
    } else if (typeOf == "function") {
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
      removeFunctionProps(result);


      if (test.name === "001-local-imports 00-sanity") {
        console.log(JSON.stringify(result, null, 2))
      }
      if (testCase.abi) {
        expect(result).toMatchObject(testCase.abi);
      }
    });
  }
});
