import { MustacheFunction } from "../functions";

export const toTypescript: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);
    let isEnum = false;

    let nullable = false;
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      nullable = true;
    }

    if (type[0] === "[") {
      return toTypescriptArray(type, nullable);
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
      case "Bytes":
        type = "ArrayBuffer";
        break;
      default:
        if (type.includes("Enum_")) {
          type = `Types.${type.replace("Enum_", "")}`;
          isEnum = true;
        } else {
          type = `Types.${type}`;
        }
    }

    return applyNullable(type, nullable, isEnum);
  };
};

// TODO: reference wasm-as/functions
const toTypescriptArray = (type: string, nullable: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z1-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const wasmType = toWasm()(result[2], (str) => str);
  return applyNullable("Array<" + wasmType + ">", nullable, false);
};
