import { fetchTestCases, findSampleBindingTestCase } from "./index";
import { readDirectory } from "../utils/fs";
import { alphabeticalNamedSort } from "../utils/sort";
import { bindSchema, OutputEntry } from "..";

import path from "path";
import {
  applyNullable,
  toMsgPack,
  toWasm,
  toWasmArray,
  toWasmInit,
} from "../bindings/wasm-as/functions";
import { generateFiles, loadSubTemplates } from "../bindings/wasm-as";

describe("Web3API Binding | Wasm AS", () => {
  describe("toMsgPack function", () => {
    it("nullable | Int", () => {
      const gqlFormat = "Int";
      const msgPackType = "NullableInt32";

      const result = toMsgPack()(gqlFormat, (str) => str);
      expect(msgPackType).toBe(result);
    });

    it("not nullable | Int", () => {
      const gqlFormat = "Int!";
      const msgPackType = "Int32";

      const result = toMsgPack()(gqlFormat, (str) => str);
      expect(msgPackType).toBe(result);
    });

    it("not nullable | Array", () => {
      const gqlFormat = "[Int]!";
      const msgPackType = "Array";

      const result = toMsgPack()(gqlFormat, (str) => str);
      expect(msgPackType).toBe(result);
    });

    it("not nullable | Boolean", () => {
      const gqlFormat = "Boolean!";
      const msgPackType = "Bool";

      const result = toMsgPack()(gqlFormat, (str) => str);
      expect(msgPackType).toBe(result);
    });

    it("not nullable | Custom type", () => {
      const gqlFormat = "CustomType!";
      const msgPackType = "CustomType";

      const result = toMsgPack()(gqlFormat, (str) => str);
      expect(msgPackType).toBe(result);
    });
  });

  describe("toWasmInit function", () => {
    it("not nullable | Int", () => {
      const gqlFormat = "Int!";
      const wasmInitType = "0";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | Array", () => {
      const gqlFormat = "[Int]!";
      const wasmInitType = "[]";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | Boolean", () => {
      const gqlFormat = "Boolean!";
      const wasmInitType = "false";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | String", () => {
      const gqlFormat = "String!";
      const wasmInitType = `""`;

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | Bytes", () => {
      const gqlFormat = "Bytes!";
      const wasmInitType = `new ArrayBuffer(0)`;

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | BigInt", () => {
      const gqlFormat = "BigInt!";
      const wasmInitType = `BigInt.fromUInt16(0)`;

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | JSON", () => {
      const gqlFormat = "JSON!";
      const wasmInitType = `JSON.Value.Null()`;

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | Custom type", () => {
      const gqlFormat = "CustomType!";
      const wasmInitType = "new Types.CustomType()";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("not nullable | Enum", () => {
      const gqlFormat = "Enum_ETestEnum!";
      const wasmInitType = "0";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("nullable | Enum", () => {
      const gqlFormat = "Enum_ETestEnum";
      const wasmInitType = "new Nullable<Types.ETestEnum>()";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("nullable | Int", () => {
      const gqlFormat = "Int";
      const wasmInitType = "new Nullable<i32>()";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });

    it("nullable | Array", () => {
      const gqlFormat = "[Int]";
      const wasmInitType = "null";

      const result = toWasmInit()(gqlFormat, (str) => str);
      expect(wasmInitType).toBe(result);
    });
  });

  describe("applyNullable function", () => {
    it("nullable", () => {
      const type = "Type";
      const formattedType = "Type | null";
      const result = applyNullable(type, true, false);

      expect(result).toBe(formattedType);
    });

    it("nullable | base type", () => {
      const type = "u32";
      const formattedType = "Nullable<u32>";
      const result = applyNullable(type, true, false);

      expect(result).toBe(formattedType);
    });

    it("nullable | enum", () => {
      const type = "ETestEnum";
      const formattedType = "Nullable<ETestEnum>";
      const result = applyNullable(type, true, true);

      expect(result).toBe(formattedType);
    });

    it("not nullable", () => {
      const type = "Type";
      const formattedType = "Type";
      const result = applyNullable(type, false, false);

      expect(result).toBe(formattedType);
    });
  });

  describe("toWasm function", () => {
    it("not nullable | Int", () => {
      const gqlFormat = "Int!";
      const wasmType = "i32";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | nullable Int Array", () => {
      const gqlFormat = "[Int]!";
      const wasmType = "Array<Nullable<i32>>";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | not nullable Int Array", () => {
      const gqlFormat = "[Int!]!";
      const wasmType = "Array<i32>";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | Boolean", () => {
      const gqlFormat = "Boolean!";
      const wasmType = "bool";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | String", () => {
      const gqlFormat = "String!";
      const wasmType = "string";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | Bytes", () => {
      const gqlFormat = "Bytes!";
      const wasmType = `ArrayBuffer`;

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | BigInt", () => {
      const gqlFormat = "BigInt!";
      const wasmType = `BigInt`;

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | JSON", () => {
      const gqlFormat = "JSON!";
      const wasmType = `JSON.Value`;

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | Custom type", () => {
      const gqlFormat = "CustomType!";
      const wasmType = "Types.CustomType";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | Enum", () => {
      const gqlFormat = "Enum_ETestEnum!";
      const wasmType = "Types.ETestEnum";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("nullable | Enum", () => {
      const gqlFormat = "Enum_ETestEnum";
      const wasmType = "Nullable<Types.ETestEnum>";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("nullable | Int", () => {
      const gqlFormat = "Int";
      const wasmType = "Nullable<i32>";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("nullable | String", () => {
      const gqlFormat = "String";
      const wasmType = "string | null";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("nullable | nullable Int Array", () => {
      const gqlFormat = "[Int]";
      const wasmType = "Array<Nullable<i32>> | null";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });
  });

  describe("toWasmArray", () => {
    it("throw an error if received Not array", () => {
      const notArray = "[Test";
      expect(() => toWasmArray(notArray, false)).toThrowError(
        `Invalid Array: ${notArray}`
      );
    });

    it("nullable | nullable Int Array", () => {
      const gqlFormat = "[Int]";
      const wasmType = "Array<Nullable<i32>> | null";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("nullable | Int Array", () => {
      const gqlFormat = "[Int!]";
      const wasmType = "Array<i32> | null";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | nullable Int Array", () => {
      const gqlFormat = "[Int]!";
      const wasmType = "Array<Nullable<i32>>";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });

    it("not nullable | Int Array", () => {
      const gqlFormat = "[Int!]!";
      const wasmType = "Array<i32>";

      const result = toWasm()(gqlFormat, (str) => str);
      expect(wasmType).toBe(result);
    });
  });

  it("loadSubTemplates", () => {
    const templatesDir = path.join(__dirname, "./test-templates");
    const directory = readDirectory(templatesDir);
    const subTemplates = loadSubTemplates(directory.entries);
    expect(subTemplates).toEqual({ test_template: "" });
  });

  it("generateFiles", () => {
    const templatesDir = path.join(__dirname, "./test-templates");
    const directory = readDirectory(templatesDir);
    const subTemplates = loadSubTemplates(directory.entries);

    const files = generateFiles(
      "./templates/interface-type",
      "File",
      subTemplates
    );

    const testFileDetectedAndGenerated = (array: OutputEntry[]) =>
      array.some((entry: OutputEntry) => entry.type === "File");

    expect(testFileDetectedAndGenerated(files)).toBe(true);
  });

  it("generateBinding", async () => {
    const cases = fetchTestCases();

    const sampleTestCase = await findSampleBindingTestCase(cases, "wasm-as");
    expect(sampleTestCase).toBeDefined();

    const sample = sampleTestCase!.outputLanguages.find(
      ({ language }) => language === "wasm-as"
    );
    const directories = sample?.directories;

    const expectedOutput = {
      query: directories?.query ? readDirectory(directories.query) : undefined,
      mutation: directories?.mutation
        ? readDirectory(directories.mutation)
        : undefined,
      combined: directories?.combined
        ? readDirectory(directories.combined)
        : undefined,
    };

    const output = bindSchema({
      bindLanguage: "wasm-as",
      query: expectedOutput.query ? sampleTestCase?.input.query : undefined,
      mutation: expectedOutput.mutation
        ? sampleTestCase?.input.mutation
        : undefined,
      combined: expectedOutput.combined
        ? sampleTestCase?.input.combined
        : undefined,
    });

    const sort = (array: OutputEntry[]): OutputEntry[] => {
      array.forEach((entry) => {
        if (typeof entry.data !== "string") entry.data = sort(entry.data);
      });

      return array.sort(alphabeticalNamedSort);
    };

    if (output.query) {
      output.query.entries = sort(output.query.entries);
    }

    if (output.mutation) {
      output.mutation.entries = sort(output.mutation.entries);
    }

    if (output.combined) {
      output.combined.entries = sort(output.combined.entries);
    }

    expect(output).toMatchObject(expectedOutput);
  });
});
