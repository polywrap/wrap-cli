/* eslint-disable @typescript-eslint/naming-convention */
const baseTypes = {
  UInt: "UInt",
  UInt8: "UInt8",
  UInt16: "UInt16",
  UInt32: "UInt32",
  UInt64: "UInt64",
  Int: "Int",
  Int8: "Int8",
  Int16: "Int16",
  Int32: "Int32",
  Int64: "Int64",
  String: "String",
  Boolean: "Boolean",
  Bytes: "Bytes",
};

export type BaseTypes = typeof baseTypes;

export type BaseType = keyof BaseTypes;

export function isBaseType(type: string): type is BaseType {
  return type in baseTypes;
}

const builtInTypes = {
  BigInt: "BigInt",
  BigNumber: "BigNumber",
  JSON: "JSON",
};

export type BuiltInTypes = typeof builtInTypes;

export type BuiltInType = keyof BuiltInTypes;

export function isBuiltInType(type: string): type is BuiltInType {
  return type in builtInTypes;
}
