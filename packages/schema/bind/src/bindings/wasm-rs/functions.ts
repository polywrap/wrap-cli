type MustacheFunction = () => (
  value: string,
  render: (template: string) => string
) => string;

function replaceAt(str: string, index: number, replacement: string): string {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function insertAt(str: string, index: number, insert: string): string {
  return str.substr(0, index) + insert + str.substr(index);
}

function removeAt(str: string, index: number): string {
  return str.substr(0, index) + str.substr(index + 1);
}

export const toLower: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    for (let i = 0; i < type.length; ++i) {
      const char = type.charAt(i);
      const lower = char.toLowerCase();

      if (char !== lower) {
        // Replace the uppercase char w/ the lowercase version
        type = replaceAt(type, i, lower);

        if (i !== 0 && type[i - 1] !== "_") {
          // Make sure all lowercase conversions have an underscore before them
          type = insertAt(type, i, "_");
        }
      }
    }

    return type;
  }
}

export const toUpper: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    // First character must always be upper case
    const firstChar = type.charAt(0);
    const firstUpper = firstChar.toUpperCase();
    type = replaceAt(type, 0, firstUpper);

    // Look for any underscores, remove them if they exist, and make next letter uppercase
    for (let i = 0; i < type.length; ++i) {
      const char = type.charAt(i);

      if (char === "_") {
        const nextChar = type.charAt(i + 1);
        const nextCharUpper = nextChar.toUpperCase();
        type = replaceAt(type, i + 1, nextCharUpper);
        type = removeAt(type, i);
      }
    }

    return type;
  }
}

export const toMsgPack: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let modifier = "";
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      modifier = "nullable_";
    }

    if (type[0] === "[") {
      return modifier + "array";
    }
    switch (type) {
      case "String":
        return modifier + "string";
      case "Bytes":
        return modifier + "bytes";
      case "BigInt":
        return modifier + "bigint";
      default:
        return modifier + toWasm()(type, (str) => str);
    }
  };
};

export const toWasmInit: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      return "None";
    }

    if (type[0] === "[") {
      return "vec![]";
    }

    switch (type) {
      case "Int":
      case "Int8":
      case "Int16":
      case "Int32":
      case "Int64":
      case "UInt":
      case "UInt8":
      case "UInt16":
      case "UInt32":
      case "UInt64":
        return "0";
      case "String":
        return "String::new()";
      case "Boolean":
        return "false";
      case "Bytes":
        return "vec![]";
      case "BigInt":
        return "BigInt::from_u16(0).unwrap_or_default()";
      default:
        if (type.includes("Enum_")) {
          return `${toWasm()(type, (str) => str)}::_MAX_`;
        } else {
          return `${toWasm()(type, (str) => str)}::new()`;
        }
    }
  };
};

export const toWasm: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let nullable = false;
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      nullable = true;
    }

    if (type[0] === "[") {
      return toWasmArray(type, nullable);
    }

    switch (type) {
      case "Int":
        type = "i32";
        break;
      case "Int8":
        type = "i8";
        break;
      case "Int16":
        type = "i16";
        break;
      case "Int32":
        type = "i32";
        break;
      case "Int64":
        type = "i64";
        break;
      case "UInt":
      case "UInt32":
        type = "u32";
        break;
      case "UInt8":
        type = "u8";
        break;
      case "UInt16":
        type = "u16";
        break;
      case "UInt64":
        type = "u64";
        break;
      case "String":
        type = "String";
        break;
      case "Boolean":
        type = "bool";
        break;
      case "Bytes":
        type = "Vec<u8>";
        break;
      case "BigInt":
        type = "BigInt";
        break;
      default:
        if (type.includes("Enum_")) {
          type = toUpper()(type.replace("Enum_", ""), (str) => str);
        } else {
          type = toUpper()(type, (str) => str);
        }
    }

    return applyNullable(type, nullable);
  };
};

const toWasmArray = (type: string, nullable: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z1-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const wasmType = toWasm()(result[2], (str) => str);
  return applyNullable("Vec<" + wasmType + ">", nullable);
};

const applyNullable = (
  type: string,
  nullable: boolean,
): string => {
  if (nullable) {
    return `Option<${type}>`;
  } else {
    return type;
  }
};
