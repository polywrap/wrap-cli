import { parseFractionType } from "../extract/utils/fraction-utils";

describe("parseFractionType", () => {
  test("Fraction<Valid!>!", () => {
    for (const type of ["Int", "Int8", "Int16", "Int32", "UInt", "UInt8", "UInt16", "UInt32"]) {
      const result = parseFractionType(`Fraction<${type}!>!`, "foo");
      expect(result).toMatchObject({
        type: `Fraction<${type}!>!`,
        subType: type,
        name: "foo",
        required: true,
      });
    }
  });

  test("Fraction<Valid!>", () => {
    for (const type of ["Int", "Int8", "Int16", "Int32", "UInt", "UInt8", "UInt16", "UInt32"]) {
      const result = parseFractionType(`Fraction<${type}!>`, "foo");
      expect(result).toMatchObject({
        type: `Fraction<${type}!>`,
        subType: type,
        name: "foo",
        required: null,
      });
    }
  });

  test("Fraction<Valid>! throws due to nullable subtype", () => {
    expect(() => parseFractionType("Fraction<Int32>!")).toThrow(
      `Nullable Fraction type Int32 found while parsing Fraction<Int32>!. Fraction type cannot be nullable. Try Fraction<Int32!>!.`
    );
  });

  test("Fraction<Invalid> throws due to unexpected subtype", () => {
    expect(() => parseFractionType("Fraction<i32>")).toThrow(
      "Invalid Fraction type i32 found while parsing Fraction<i32>. Valid types: Int! | Int8! | Int16! | Int32! | UInt! | UInt8! | UInt16! | UInt32!."
    );
  });

  test("Fraction< throws due to no closing bracket", () => {
    expect(() => parseFractionType("Fraction<i32")).toThrow("Invalid Fraction: Fraction<i32");
  });
});
