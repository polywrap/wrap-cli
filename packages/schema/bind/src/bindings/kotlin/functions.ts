import { MustacheFn } from "../types";
import { isKeyword } from "./types";
import { toUpper } from "../rust/functions";

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

const firstUpper = (str: string) =>
  str ? str[0].toUpperCase() + str.slice(1) : "";

export const toClassName: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    const rendered = render(value);
    return rendered
      .replace(/([^A-Za-z0-9])+/g, ",")
      .split(",")
      .map((x) => (x ? firstUpper(x.replace(",", "")) : ""))
      .join("");
  };
};

export const toKotlin: MustacheFn = () => {
  return _toKotlin;
};

const _toKotlin = (value: string, render: (template: string) => string) => {
  let type = render(value);

  let optional = false;
  if (type[type.length - 1] === "!") {
    type = type.substring(0, type.length - 1);
  } else {
    optional = true;
  }

  if (type[0] === "[") {
    return toKotlinArray(type, optional);
  }

  if (type.startsWith("Map<")) {
    return toKotlinMap(type, optional);
  }

  switch (type) {
    case "Int8":
      type = "Byte";
      break;
    case "Int16":
      type = "Short";
      break;
    case "Int":
    case "Int32":
      type = "Int";
      break;
    case "Int64":
      type = "Long";
      break;
    case "UInt8":
      type = "UByte";
      break;
    case "UInt16":
      type = "UShort";
      break;
    case "UInt":
    case "UInt32":
      type = "UInt";
      break;
    case "UInt64":
      type = "ULong";
      break;
    case "String":
      type = "String";
      break;
    case "Boolean":
      type = "Boolean";
      break;
    case "Bytes":
      type = "ByteArray";
      break;
    case "BigInt":
      type = "BigInt";
      break;
    case "BigNumber":
      type = "BigNumber";
      break;
    case "JSON":
      type = "Json";
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

const toKotlinArray = (type: string, optional: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z0-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const ktType = _toKotlin(result[2], (str) => str);
  return applyOptional("Array<" + ktType + ">", optional);
};

const toKotlinMap = (type: string, optional: boolean): string => {
  const openAngleBracketIdx = type.indexOf("<");
  const closeAngleBracketIdx = type.lastIndexOf(">");

  const keyValTypes = type.substring(
    openAngleBracketIdx + 1,
    closeAngleBracketIdx
  );

  const firstCommaIdx = keyValTypes.indexOf(",");
  const keyType = keyValTypes.substring(0, firstCommaIdx).trim();
  const valType = keyValTypes.substring(firstCommaIdx + 1).trim();

  const ktKeyType = _toKotlin(keyType, (str) => str);
  const ktValType = _toKotlin(valType, (str) => str);

  return applyOptional(`Map<${ktKeyType}, ${ktValType}>`, optional);
};

const applyOptional = (type: string, optional: boolean): string => {
  if (optional) {
    return `${type}?`;
  } else {
    return type;
  }
};

export const nullableDefault: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    const rendered = render(value);
    return rendered.endsWith("?") ? rendered + " = null" : rendered;
  };
};
