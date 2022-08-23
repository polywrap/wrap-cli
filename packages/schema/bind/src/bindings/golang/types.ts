const types = {
  u8: "u8",
  u16: "u16",
  u32: "u32",
  i8: "i8",
  i16: "i16",
  i32: "i32",
  string: "string",
  bool: "bool",
};

export type BaseTypes = typeof types;

export type BaseType = keyof BaseTypes;

export function isBaseType(type: string): type is BaseType {
  return type in types;
}
