import { MustacheFn } from "../types";
import { isBaseType, isKeyword } from "./types";

// check if any of the keywords match the property name;
// if there's a match, insert `_` at the beginning of the property name.
export const detectKeyword: MustacheFn = () => {
  return (value: string, render: (template: string) => string): string => {
    const type = render(value);
    if (isKeyword(type)) {
      return "_" + type;
    }
    return type;
  };
};

export const toMsgPack: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let modifier = "";
    if (type[type.length - 1] === "!") {
      type = type.substring(0, type.length - 1);
    } else {
      modifier = "Optional";
    }

    if (type[0] === "[") {
      return modifier + "Array";
    }
    if (type.startsWith("Map<")) {
      return modifier + "ExtGenericMap";
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

export const toWasmInit: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    if (type[type.length - 1] === "!") {
      type = type.substring(0, type.length - 1);
    } else {
      const nullType = toWasm()(value, render);
      const nullOptional = "| null";

      if (nullType.endsWith(nullOptional)) {
        return "null";
      }
    }

    if (type[0] === "[") {
      return "[]";
    }

    if (type.startsWith("Map<")) {
      const firstOpenBracketIdx = type.indexOf("<");
      const lastCloseBracketIdx = type.lastIndexOf(">");
      if (firstOpenBracketIdx === -1 || lastCloseBracketIdx === -1) {
        throw new Error(`Invalid Map: ${type}`);
      }

      const keyValTypes = type.substring(
        firstOpenBracketIdx + 1,
        lastCloseBracketIdx
      );

      const firstCommaIdx = keyValTypes.indexOf(",");
      if (firstCommaIdx === -1) {
        throw new Error(`Invalid Map: ${type}`);
      }

      const keyType = keyValTypes.substring(0, firstCommaIdx).trim();
      const valType = keyValTypes.substring(firstCommaIdx + 1).trim();

      const wasmKeyType = toWasm()(keyType, (str) => str);
      const wasmValType = toWasm()(valType, (str) => str);

      return `new Map<${wasmKeyType}, ${wasmValType}>()`;
    }

    switch (type) {
      case "Int":
      case "Int8":
      case "Int16":
      case "Int32":
      case "UInt":
      case "UInt8":
      case "UInt16":
      case "UInt32":
        return "0";
      case "String":
        return `""`;
      case "Boolean":
        return "false";
      case "Bytes":
        return `new ArrayBuffer(0)`;
      case "BigInt":
        return `BigInt.fromUInt16(0)`;
      case "BigNumber":
        return `new BigNumber(BigInt.fromUInt16(0), 0, 0)`;
      case "JSON":
        return `JSON.Value.Null()`;
      default:
        if (type.includes("Enum_")) {
          return "0";
        } else {
          type = detectKeyword()(type, (str) => str);
          return `new Types.${type}()`;
        }
    }
  };
};

export const toWasm: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);
    let isEnum = false;

    let optional = false;
    if (type[type.length - 1] === "!") {
      type = type.substring(0, type.length - 1);
    } else {
      optional = true;
    }

    if (type[0] === "[") {
      return toWasmArray(type, optional);
    }

    if (type.startsWith("Map<")) {
      return toWasmMap(type, optional);
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
      case "String":
        type = "string";
        break;
      case "Boolean":
        type = "bool";
        break;
      case "Bytes":
        type = "ArrayBuffer";
        break;
      case "BigInt":
        type = "BigInt";
        break;
      case "BigNumber":
        type = "BigNumber";
        break;
      case "JSON":
        type = "JSON.Value";
        break;
      default:
        if (type.includes("Enum_")) {
          type = type.replace("Enum_", "");
          isEnum = true;
        }
        type = detectKeyword()(type, (str) => str);
        type = `Types.${type}`;
    }

    return applyOptional(type, optional, isEnum);
  };
};

const toWasmArray = (type: string, optional: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z0-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const wasmType = toWasm()(result[2], (str) => str);
  return applyOptional("Array<" + wasmType + ">", optional, false);
};

const toWasmMap = (type: string, optional: boolean): string => {
  const firstOpenBracketIdx = type.indexOf("<");
  const lastCloseBracketIdx = type.lastIndexOf(">");

  if (firstOpenBracketIdx === -1 || lastCloseBracketIdx === -1) {
    throw new Error(`Invalid Map: ${type}`);
  }

  const keyValTypes = type.substring(
    firstOpenBracketIdx + 1,
    lastCloseBracketIdx
  );

  const firstCommaIdx = keyValTypes.indexOf(",");
  if (firstCommaIdx === -1) {
    throw new Error(`Invalid Map: ${type}`);
  }

  const keyType = keyValTypes.substring(0, firstCommaIdx).trim();
  const valType = keyValTypes.substring(firstCommaIdx + 1).trim();

  const wasmKeyType = toWasm()(keyType, (str) => str);
  const wasmValType = toWasm()(valType, (str) => str);

  return applyOptional(`Map<${wasmKeyType}, ${wasmValType}>`, optional, false);
};

const applyOptional = (
  type: string,
  optional: boolean,
  isEnum: boolean
): string => {
  if (optional) {
    if (
      type.indexOf("Array") === 0 ||
      type.indexOf("string") === 0 ||
      (!isEnum && !isBaseType(type))
    ) {
      return `${type} | null`;
    } else {
      return `Nullable<${type}> | null`;
    }
  } else {
    return type;
  }
};
