import { fetchTestCases, findSampleBindingTestCase } from "./index";
import { readDirectory } from "../utils/fs";
import { alphabeticalNamedSort } from "../utils/sort";
import { bindSchema, OutputEntry } from "../";

import {
  applyNullable,
  toTypescript,
  toTypescriptArray,
} from "../bindings/plugin-ts/functions";

describe("Web3API Binding | Plugin TS", () => {
  describe("toTypescript function", () => {
    it("not nullable type | Int", () => {
      const gqlFormat = "Int!";
      const tsType = "Int";

      const result = toTypescript()(gqlFormat, (str) => str);
      expect(tsType).toBe(result);
    });

    it("nullable type | Int", () => {
      const gqlFormat = "Int";
      const tsType = "Int | null";

      const result = toTypescript()(gqlFormat, (str) => str);
      expect(tsType).toBe(result);
    });

    it("nullable type | JSON", () => {
      const gqlFormat = "JSON";
      const tsType = "Json | null";

      const result = toTypescript()(gqlFormat, (str) => str);
      expect(tsType).toBe(result);
    });

    it("nullable type | Enum", () => {
      const gqlFormat = "Enum_ETestEnum";
      const tsType = "Types.ETestEnum | null";

      const result = toTypescript()(gqlFormat, (str) => str);
      expect(tsType).toBe(result);
    });

    it("nullable type | Custom type", () => {
      const gqlFormat = "CustomType";
      const tsType = "Types.CustomType | null";

      const result = toTypescript()(gqlFormat, (str) => str);
      expect(tsType).toBe(result);
    });
  });

  describe("toTypescriptArray function", () => {
    it("not nullable element", () => {
      const gqlFormat = "[Type!]";
      const tsFormat = "Array<Types.Type>";
      const result = toTypescriptArray(gqlFormat, false);

      expect(result).toBe(tsFormat);
    });

    it("nullable element", () => {
      const gqlFormat = "[Type]";
      const tsFormat = "Array<Types.Type | null>";
      const result = toTypescriptArray(gqlFormat, false);

      expect(result).toBe(tsFormat);
    });

    it("nullable array", () => {
      const gqlFormat = "[Type!]";
      const tsFormat = "Array<Types.Type> | null";
      const result = toTypescriptArray(gqlFormat, true);

      expect(result).toBe(tsFormat);
    });
  });

  describe("applyNullable function", () => {
    it("not nullable type", () => {
      const type = "Type";
      const formattedType = "Type";
      const result = applyNullable(type, false);

      expect(result).toBe(formattedType);
    });

    it("nullable type", () => {
      const type = "Type";
      const formattedType = "Type | null";
      const result = applyNullable(type, true);

      expect(result).toBe(formattedType);
    });
  });

  it("generateBinding", async () => {
    const cases = fetchTestCases();

    const sampleTestCase = await findSampleBindingTestCase(cases, "plugin-ts");
    expect(sampleTestCase).toBeDefined();

    const sample = sampleTestCase!.outputLanguages.find(
      ({ language }) => language === "plugin-ts"
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
      bindLanguage: "plugin-ts",
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
