import {
  createMapDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
  createUnresolvedObjectOrEnumRef,
} from "../abi";
import {
  parseCurrentType,
  parseMapType,
  toGraphQLType,
} from "../extract/utils/map-utils";

describe("parseMapType", () => {
  test("Map<String, Int>", () => {
    const result = parseMapType("Map<String, Int>");
    expect(result).toMatchObject(
      createMapDefinition({
        type: "Map<String, Int>",
        key: createMapKeyDefinition({ type: "String" }),
        value: createScalarDefinition({ type: "Int" }),
      })
    );
  });

  test("Map<String, CustomType!>", () => {
    const result = parseMapType("Map<String, CustomType!>");
    expect(result).toMatchObject(
      createMapDefinition({
        type: "Map<String, CustomType>",
        key: createMapKeyDefinition({
          type: "String",
        }),
        value: createUnresolvedObjectOrEnumRef({
          type: "CustomType",
          required: true,
        }),
      })
    );
  });

  test("Map<Int, Array<String>!>", () => {
    const result = parseMapType("Map<Int, Array<String>!>", "customMap");
    expect(result).toMatchObject({
      name: "customMap",
      type: "Map<Int, [String]>",
      key: {
        name: "customMap",
        type: "Int",
      },
      value: {
        name: "customMap",
        type: "[String]",
        item: {
          type: "String",
        },
        required: true,
      },
    });
  });

  test("Map<Int, [String]!>", () => {
    const result = parseMapType("Map<Int, [String]!>");
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
      },
    });
  });

  test("Map<String!, Map<String!, Int!>!>!", () => {
    const result = parseMapType("Map<String!, Map<String!, Int!>!>!");
    expect(result).toMatchObject({
      type: "Map<String, Map<String, Int>>",
      key: {
        type: "String",
        required: true
      },
      value: {
        type: "Map<String, Int>",
        key: {
          type: "String",
          required: true
        },
        value: {
          type: "Int",
          required: true,
        },
        required: true,
      },
      required: true,
    });
  });

  test("Map<CustomType, String!>", () => {
    expect(() => parseMapType("Map<CustomType, String!>")).toThrow(
      "Found invalid map key type: CustomType while parsing Map<CustomType, String!>"
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
});

describe("parseCurrentType", () => {
  test("Map<String, Int>", () => {
    const result = parseCurrentType("Map<String, Int>");
    expect(result).toMatchObject({
      currentType: "Map",
      subType: "String, Int",
    });
  });

  test("Map<String, CustomType!>", () => {
    const result = parseCurrentType("Map<String, CustomType!>");
    expect(result).toMatchObject({
      currentType: "Map",
      subType: "String, CustomType!",
    });
  });

  test("Map<Int, Array<String>!>!", () => {
    const result = parseCurrentType("Map<Int, Array<String>!>!");
    expect(result).toMatchObject({
      currentType: "Map",
      subType: "Int, Array<String>!",
      required: true,
    });
  });

  test("Array<String!>!", () => {
    const result = parseCurrentType("Array<String!>!");
    expect(result).toMatchObject({
      currentType: "Array",
      subType: "String!",
      required: true,
    });
  });

  test("Map<String!, Map<String!, Int!>!>!", () => {
    const result = parseCurrentType("Map<String!, Map<String!, Int!>!>!");
    expect(result).toMatchObject({
      currentType: "Map",
      subType: "String!, Map<String!, Int!>!",
      required: true,
    });
  });

  test("CustomType!", () => {
    const result = parseCurrentType("CustomType!");
    expect(result).toMatchObject({
      currentType: "CustomType",
      required: true,
    });
  });

  test("String", () => {
    const result = parseCurrentType("String");
    expect(result).toMatchObject({
      currentType: "String",
    });
  });
});
