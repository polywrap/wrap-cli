export const MapKeyTypes = {
  UInt: "UInt",
  UInt8: "UInt8",
  UInt16: "UInt16",
  UInt32: "UInt32",
  Int: "Int",
  Int8: "Int8",
  Int16: "Int16",
  Int32: "Int32",
  String: "String",
};

export const ScalarTypes = {
  ...MapKeyTypes,
  Boolean: "Boolean",
  Bytes: "Bytes",
  BigInt: "BigInt",
  BigNumber: "BigNumber",
  JSON: "JSON",
};

export type ScalarType = keyof typeof ScalarTypes;
export type MapKeyType = keyof typeof MapKeyTypes;

export function isMapKeyType(type: string): type is MapKeyType {
  return type in MapKeyTypes;
}

export const MODULE_NAME = "Module";

export function isModuleType(type: string): boolean {
  return type === MODULE_NAME;
}

export function isImportedModuleType(type: string): boolean {
  return type.endsWith(`_${MODULE_NAME}`);
}

export function isScalarType(type: string): type is ScalarType {
  return type in ScalarTypes;
}

export const scalarTypeNames = Object.keys(ScalarTypes);
