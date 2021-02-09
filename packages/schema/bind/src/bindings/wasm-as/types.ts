const msgPackTypes = {
  u8: "u8",
  u16: "u16",
  u32: "u32",
  u64: "u64",
  i8: "i8",
  i16: "i16",
  i32: "i32",
  i64: "i64",
  bool: "bool",
};

export type MsgPackTypes = typeof msgPackTypes;

export type MsgPackType = keyof MsgPackTypes;

export function isMsgPackType(type: string): type is MsgPackType {
  return type in msgPackTypes;
}
