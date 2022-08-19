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

      const sort = (obj: any) => Object
        .keys(obj)
        .sort()
        .reduce((map: any, key) => {
          if (typeof obj[key] === "object") {
            map[key] = sort(obj[key]);

            if (Array.isArray(obj[key])) {
              map[key] = Object.values(map[key]);
            }
          } else {
            map[key] = obj[key];
          }
          return map
        }, {});

      expect(sort(result)).toMatchObject(sort(testCase.output));
    });
  }
});
