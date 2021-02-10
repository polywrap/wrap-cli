import { isMsgPackType } from "./types";

type MustacheFunction = () => (
  value: string,
  render: (template: string) => string
) => string;

export const toMsgPack: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let modifier = "";
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      modifier = "Nullable";
    }

    if (type[0] === "[") {
      return modifier + "Array";
    }
    switch (type) {
      case "Int":
        return modifier + "Int32";
      case "UInt":
        return modifier + "UInt32";
      case "Boolean":
        return modifier + "Bool";
      default:
        return modifier + type;
    }
  };
};

export const toWasmInit: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      const nullType = toWasm()(value, render);
      const nullable = "Nullable";

      if (nullType.substr(0, nullable.length) === nullable) {
        return `new ${nullType}()`;
      } else {
        return "null";
      }
    }

    if (type[0] === "[") {
      return "[]";
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
        return `""`;
      case "Boolean":
        return "false";
      default:
        if (type.includes("enum_")) {
          return 0;
        } else {
          return `new ${type}()`;
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
        type = "string";
        break;
      case "Boolean":
        type = "bool";
        break;
      default:
        if (type.includes("enum_")) {
          type = type.replace("enum_", "Enums.");
        } else {
          type = `Objects.${type}`;
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
  return applyNullable("Array<" + wasmType + ">", nullable);
};

const applyNullable = (type: string, nullable: boolean): string => {
  if (nullable) {
    if (
      type.indexOf("Array") === 0 ||
      type.indexOf("string") === 0 ||
      (!type.includes("Enums.") && !isMsgPackType(type))
    ) {
      return `${type} | null`;
    } else {
      return `Nullable<${type}>`;
    }
  } else {
    return type;
  }
};
