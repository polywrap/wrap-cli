import { isKeyword } from "./types";
import { MustacheFn } from "../types";

function replaceAt(str: string, index: number, replacement: string): string {
  return (
    str.substr(0, index) + replacement + str.substr(index + replacement.length)
  );
}

function insertAt(str: string, index: number, insert: string): string {
  return str.substr(0, index) + insert + str.substr(index);
}

function removeAt(str: string, index: number): string {
  return str.substr(0, index) + str.substr(index + 1);
}

export const toLower: MustacheFn = () => {
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
  };
};

export const toUpper: MustacheFn = () => {
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
  };
};

export const noBox: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    const type = render(value);
    const extract = /(.*)Box<([a-zA-Z0-9]*)>(.*)/gm;
    const match = [...type.matchAll(extract)];

    if (match.length === 0) {
      return type;
    }

    const strings = match[0] as string[];
    return strings[1] + strings[2] + strings[3];
  };
};

export const toMsgPack: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let modifier = "";
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      modifier = "optional_";
    }

    if (type[0] === "[") {
      return modifier + "array";
    }
    if (type.startsWith("Map<")) {
      return modifier + "ext_generic_map";
    }

    switch (type) {
      case "Int":
        return modifier + "i32";
      case "Int8":
        return modifier + "i8";
      case "Int16":
        return modifier + "i16";
      case "Int32":
        return modifier + "i32";
      case "Int64":
        return modifier + "i64";
      case "UInt":
      case "UInt32":
        return modifier + "u32";
      case "UInt8":
        return modifier + "u8";
      case "UInt16":
        return modifier + "u16";
      case "UInt64":
        return modifier + "u64";
      case "String":
        return modifier + "string";
      case "Boolean":
        return modifier + "bool";
      case "Bytes":
        return modifier + "bytes";
      case "BigInt":
        return modifier + "bigint";
      case "BigNumber":
        return modifier + "bignumber";
      case "JSON":
        return modifier + "json";
      default:
        throw Error(`Unknown toWasm type "${type}"`);
    }
  };
};

export const toWasmInit: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);
    let optional = false;

    const optionalModifier = (str: string): string => {
      return !optional ? str : "None";
    };

    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      optional = true;
    }

    if (type[0] === "[") {
      return optionalModifier("vec![]");
    }

    if (type.startsWith("Map<")) {
      const openBracketIdx = type.indexOf("<");
      const closeBracketIdx = type.lastIndexOf(">");
      const [key, value] = type
        .substring(openBracketIdx + 1, closeBracketIdx)
        .split(",")
        .map((x) => toWasm()(x.trim(), render));
      return `Map::<${key}, ${value}>::new()`;
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
        return optionalModifier("0");
      case "String":
        return optionalModifier("String::new()");
      case "Boolean":
        return optionalModifier("false");
      case "Bytes":
        return optionalModifier("vec![]");
      case "BigInt":
        return optionalModifier("BigInt::default()");
      case "BigNumber":
        return optionalModifier("BigNumber::default()");
      case "JSON":
        return optionalModifier("JSON::Value::Null");
      default:
        if (type.includes("Enum_")) {
          return optionalModifier(`${toWasm()(value, render)}::_MAX_`);
        } else {
          return optionalModifier(`${toWasm()(value, render)}::new()`);
        }
    }
  };
};

export const toWasm: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let optional = false;
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
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
      case "BigNumber":
        type = "BigNumber";
        break;
      case "JSON":
        type = "JSON::Value";
        break;
      default:
        if (type.includes("Enum_")) {
          type = type.replace("Enum_", "");
        }
        type = toUpper()(type, (str) => str);
        type = detectKeyword()(type, (str) => str);
    }

    return applyOptional(type, optional);
  };
};

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

const toWasmArray = (type: string, optional: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z1-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const wasmType = toWasm()(result[2], (str) => str);
  return applyOptional("Vec<" + wasmType + ">", optional);
};

const toWasmMap = (type: string, optional: boolean): string => {
  const firstOpenBracketIdx = type.indexOf("<");
  const lastCloseBracketIdx = type.lastIndexOf(">");

  if (!(firstOpenBracketIdx !== -1 && lastCloseBracketIdx !== -1)) {
    throw new Error(`Invalid Map: ${type}`);
  }

  const keyValTypes = type
    .substring(firstOpenBracketIdx + 1, lastCloseBracketIdx)
    .split(",")
    .map((x) => x.trim());

  if (keyValTypes.length !== 2 || !keyValTypes[0] || !keyValTypes[1]) {
    throw new Error(`Invalid Map: ${type}`);
  }

  const keyType = toWasm()(keyValTypes[0], (str) => str);
  const valType = toWasm()(keyValTypes[1], (str) => str);

  return applyOptional(`Map<${keyType}, ${valType}>`, optional);
};

const applyOptional = (type: string, optional: boolean): string => {
  if (optional) {
    return `Option<${type}>`;
  } else {
    return type;
  }
};
