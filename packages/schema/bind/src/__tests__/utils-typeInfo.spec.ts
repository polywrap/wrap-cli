import { fetchTestCases, findSampleBindingTestCase } from "./index";
import { findCommonTypes, extendCommonTypes } from "..";

describe("Web3API Binding | Utils | TypeInfo", () => {
  it("findCommonTypes function", async () => {
    const expectedCommonTypes = [
      "AnotherType",
      "CustomType",
      "CustomEnum",
      "TestImport_Enum",
      "TestImport_Object",
      "TestImport_AnotherObject",
      "TestImport_Query",
    ];

    const cases = fetchTestCases();

    const sampleTestCase = await findSampleBindingTestCase(cases, "wasm-as");
    expect(sampleTestCase).toBeDefined();

    const sample = sampleTestCase!.outputLanguages.find(
      ({ language }) => language === "wasm-as"
    );

    const query = sample?.directories?.query
      ? sampleTestCase?.input.query
      : undefined;
    const mutation = sample?.directories?.mutation
      ? sampleTestCase?.input.mutation
      : undefined;

    expect(query).toBeDefined();
    expect(mutation).toBeDefined();

    const foundTypes = findCommonTypes(query!.typeInfo, mutation!.typeInfo);

    const identicalCommonTypesList =
      foundTypes.length == expectedCommonTypes.length &&
      foundTypes.every((type, i) => {
        return type === expectedCommonTypes[i];
      });

    expect(identicalCommonTypesList).toBe(true);
  });

  it("extendCommonTypes function", async () => {
    const expectedCommonTypes = [
      "AnotherType",
      "CustomType",
      "CustomEnum",
      "TestImport_Enum",
      "TestImport_Object",
      "TestImport_AnotherObject",
      "TestImport_Query",
    ];

    expect(extendCommonTypes(expectedCommonTypes).enter).toBeDefined();
  });
});
