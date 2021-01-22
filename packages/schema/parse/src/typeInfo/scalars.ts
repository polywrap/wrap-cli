export const SupportedScalars = {
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
};

export function isScalar(type: string): boolean {
  return type in SupportedScalars;
}
