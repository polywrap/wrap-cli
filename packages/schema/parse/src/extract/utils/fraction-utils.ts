import { createFractionDefinition, GenericDefinition } from "../..";

export function parseFractionType(
  type: string,
  name?: string
): GenericDefinition {
  const result = type.match(
    /^Fraction<(Int|Int8|Int16|Int32|UInt|UInt8|UInt16|UInt32)(!?)>(!?)$/
  );

  if (!result || result.length !== 4) {
    const typeFound = type.match(/^Fraction<(.+)>(!?)$/);
    if (!typeFound || typeFound.length !== 3) {
      throw Error(`Invalid Fraction: ${type}`);
    }
    throw Error(
      `Invalid Fraction type ${typeFound[1]} found while parsing ${type}. Valid types: Int! | Int8! | Int16! | Int32! | UInt! | UInt8! | UInt16! | UInt32!.`
    );
  }

  if (result[2] !== "!") {
    throw Error(
      `Nullable Fraction type ${result[1]} found while parsing ${type}. Fraction type cannot be nullable. Try Fraction<${result[1]}!>${result[3]}.`
    );
  }

  return createFractionDefinition({
    name,
    type,
    subType: result[1],
    required: result[3] === "!",
  });
}
