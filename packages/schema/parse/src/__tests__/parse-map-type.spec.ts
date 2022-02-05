import { parseMapType, toGraphQLType } from "../extract/utils/map-utils";

describe("parseMapType", () => {
  test("Map<String, Int>", () => {
    const result = parseMapType("Map<String, Int>");
    expect(result).toMatchObject({
      type: "Map<String, Int>",
      key: {
        type: "String",
      },
      value: {
        type: "Int",
      },
    });
  });

  test("Map<String, CustomType!>", () => {
    const result = parseMapType("Map<String, CustomType!>");
    expect(result).toMatchObject({
      type: "Map<String, CustomType>",
      key: {
        type: "String",
      },
      value: {
        type: "CustomType",
        required: true,
      },
    });
  });

  test("Map<Int, Array<String>!>", () => {
    const result = parseMapType("Map<Int, Array<String>!>");
    expect(result).toMatchObject({
      type: "Map<Int, [String]>",
      key: {
        type: "Int",
      },
      value: {
        type: "[String]",
        item: {
          type: "String",
        },
        required: true,
      }
    });
  });

  test("Map<CustomType, String!>", () => {
    expect(() => parseMapType("Map<CustomType, String!>")).toThrow(
      "Invalid map key type: CustomType"
    );
  });
});


describe("toGraphQLType", () => {
  test("Map<String, Int>", () => {
    const result = toGraphQLType("Map<String, Int>");
    expect(result).toBe("Map<String, Int>");
  });

  test("Map<String, CustomType!>", () => {
    const result = toGraphQLType("Map<String, CustomType!>");
    expect(result).toBe("Map<String, CustomType>");
  });

  test("Map<Int, Array<String>!>", () => {
    const result = toGraphQLType("Map<Int, Array<String>!>");
    expect(result).toBe("Map<Int, [String]>");
  });

  test("Array<String!>!", () => {
    const result = toGraphQLType("Array<String!>!");
    expect(result).toBe("[String]");
  });
})