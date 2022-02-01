import { parseMapType } from "../extract/utils/map-utils";

describe("parseMapType", () => {
  test("Map[String, Int]", () => {
    const result = parseMapType("Map[String, Int]");
    expect(result).toMatchObject({
      type: "Map",
      key: {
        type: "String",
      },
      value: {
        type: "Int",
      },
    });
  });

  test("Map[String, CustomType!]", () => {
    const result = parseMapType("Map[String, CustomType!]");
    expect(result).toMatchObject({
      type: "Map",
      key: {
        type: "String",
      },
      value: {
        type: "CustomType",
        required: true,
      },
    });
  });

  test("Map[Int, Array[String]!]", () => {
    const result = parseMapType("Map[Int, Array[String]!]");
    expect(result).toMatchObject({
      type: "Map",
      key: {
        type: "Int",
      },
      value: {
        type: "N/A",
        item: {
          type: "String",
        },
        required: true,
      }
    });
  });

  test("Map[CustomType, String!]", () => {
    expect(() => parseMapType("Map[CustomType, String!]")).toThrow(
      "Invalid map key type: CustomType"
    );
  });
});
