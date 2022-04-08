export const mapKeyTypes = {
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

export type MapKeyTypes = typeof mapKeyTypes;

export type MapKeyType = keyof MapKeyTypes;

export const mapKeyTypeNames = Object.keys(mapKeyTypes);

export function isMapKeyType(type: string): type is MapKeyType {
  return type in mapKeyTypes;
}
