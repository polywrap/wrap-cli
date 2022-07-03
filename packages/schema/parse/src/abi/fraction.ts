export const fractionTypes = {
  UInt: "UInt",
  UInt8: "UInt8",
  UInt16: "UInt16",
  UInt32: "UInt32",
  Int: "Int",
  Int8: "Int8",
  Int16: "Int16",
  Int32: "Int32",
};

export type FractionTypes = typeof fractionTypes;

export type FractionType = keyof FractionTypes;

export const fractionTypeNames = Object.keys(fractionTypes);

export function isFractionType(type: string): type is FractionType {
  return type in fractionTypes;
}
