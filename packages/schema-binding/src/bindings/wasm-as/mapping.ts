export type MustacheFunction = () => (
  value: string, render: (template: string) => string
) => string

export const toMsgPack: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    const name = render(value);
    switch (name) {
      case "Int":
        return "Int32";
      case "UInt":
        return "UInt32";
      default:
        return name;
    }
  }
}

export const toWasm: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    const name = render(value);
    switch (name) {
      case "Int": return "i32";
      case "Int8": return "i8";
      case "Int16": return "i16";
      case "Int32": return "i32";
      case "Int64": return "i64";
      case "UInt": return "u32";
      case "UInt8": return "u8";
      case "UInt16": return "u16";
      case "UInt32": return "u32";
      case "UInt64": return "u64";
      case "String": return "string";
      default: return name;
    }
  }
}
