import { MustacheFn } from "../types";
import { isKeyword } from "./types";

// check if any of the keywords match the property name;
// if there's a match, insert `_` at the beginning of the property name.
export const detectKeyword: MustacheFn = () => {
  return (value: string, render: (template: string) => string): string => {
    const type = render(value);
    if (type == "str") {
      console.log(type);
      console.log(isKeyword(type));
    }
    if (isKeyword(type)) {
      return "p_" + type; // `p_` is the prefix we use for keywords
    }
    return type;
  };
};

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

export const toPython: MustacheFn = () => {
  return _toPython;
};

const _toPython = (value: string, render: (template: string) => string) => {
  let type = render(value);

  let optional = false;
  if (type[type.length - 1] === "!") {
    type = type.substring(0, type.length - 1);
  } else {
    optional = true;
  }

  if (type[0] === "[") {
    return toPythonList(type, optional);
  }

  if (type.startsWith("Map<")) {
    return toPythonGenericMap(type, optional);
  }

  switch (type) {
    case "Int":
    case "Int8":
    case "Int16":
    case "Int32":
    case "Int64":
    case "UInt":
    case "UInt32":
    case "UInt8":
    case "UInt16":
    case "UInt64":
      type = "int";
      break;
    case "JSON":
    case "String":
    case "BigInt":
    case "BigNumber":
      type = "str";
      break;
    case "Boolean":
      type = "bool";
      break;
    case "Bytes":
      type = "bytes";
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

const toPythonList = (type: string, optional: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z0-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid List: ${type}`);
  }

  const tsType = _toPython(result[2], (str) => str);
  return applyOptional("list[" + tsType + "]", optional);
};

const toPythonGenericMap = (type: string, optional: boolean): string => {
  const openAngleBracketIdx = type.indexOf("<");
  const closeAngleBracketIdx = type.lastIndexOf(">");

  const keyValTypes = type.substring(
    openAngleBracketIdx + 1,
    closeAngleBracketIdx
  );

  const firstCommaIdx = keyValTypes.indexOf(",");
  const keyType = keyValTypes.substring(0, firstCommaIdx).trim();
  const valType = keyValTypes.substring(firstCommaIdx + 1).trim();

  const tsKeyType = _toPython(keyType, (str) => str);
  const tsValType = _toPython(valType, (str) => str);

  return applyOptional(`GenericMap[${tsKeyType}, ${tsValType}]`, optional);
};

const applyOptional = (type: string, optional: boolean): string => {
  if (optional) {
    return `${type} | None`;
  } else {
    return type;
  }
};
