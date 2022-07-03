export const scalarTypes = {
  UInt: "UInt",
  UInt8: "UInt8",
  UInt16: "UInt16",
  UInt32: "UInt32",
  Int: "Int",
  Int8: "Int8",
  Int16: "Int16",
  Int32: "Int32",
  String: "String",
  Boolean: "Boolean",
  Bytes: "Bytes",
  BigInt: "BigInt",
  BigNumber: "BigNumber",
  BigFraction: "BigFraction",
  JSON: "JSON",
};

export type ScalarTypes = typeof scalarTypes;

export type ScalarType = keyof ScalarTypes;

export function isScalarType(type: string): type is ScalarType {
  return type in scalarTypes;
}

export const scalarTypeNames = Object.keys(scalarTypes);
