export const supportedScalars = [
  "UInt",
  "UInt8",
  "UInt16",
  "UInt32",
  "UInt64",
  "Int",
  "Int8",
  "Int16",
  "Int32",
  "Int64",
  "String",
];

export function isScalar(type: string): boolean {
  return supportedScalars.includes(type);
}
