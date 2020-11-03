export type MustacheFunction = () => (
  value: string, render: (template: string) => string
) => string

export const toMsgPack: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let name = render(value);
    let modifier = "";
    if (name[0] === "?") {
      name = name.substr(1);
      modifier = "Nullable";
    }
    if (name[0] === "[") {
      return modifier + "Array";
    }
    switch (name) {
      case "Int":
        return modifier + "Int32";
      case "UInt":
        return modifier + "UInt32";
      default:
        return modifier + name;
    }
  }
}

export const toWasm: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let name = render(value);

    let modifier = "";

    if (name[0] === "?") {
      name = name.substr(1);
      modifier = " | null";
    }

    if (name[0] === "[") {
      return toWasmArray(name, modifier);
    }

    switch (name) {
      case "Int": return "i32" + modifier;
      case "Int8": return "i8" + modifier;
      case "Int16": return "i16" + modifier;
      case "Int32": return "i32" + modifier;
      case "Int64": return "i64" + modifier;
      case "UInt": return "u32" + modifier;
      case "UInt8": return "u8" + modifier;
      case "UInt16": return "u16" + modifier;
      case "UInt32": return "u32" + modifier;
      case "UInt64": return "u64" + modifier;
      case "String": return "string" + modifier;
      default: return name;
    }
  }
}

const toWasmArray = (name: string, modifier: string) => {
    const result = name.match(/(\[)([?[\]A-Za-z1-9]+)(\])/);

    if (!result || result.length !== 4) {
      throw Error(`Invalid Array: ${name}`);
    }

    const wasmType = toWasm()(result[2], (str) => str);
    return "Array<" + wasmType + ">" + modifier;
  }
}
