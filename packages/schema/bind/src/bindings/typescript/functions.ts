import { MustacheFn } from "../types";
import { isKeyword } from "./types";

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

const firstLower = (str: string) =>
  str ? str[0].toLowerCase() + str.slice(1) : "";

export const toLowerCase: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    const rendered = render(value);
    return rendered.toLowerCase();
  };
};

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

export const toFuncName: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let rendered = render(value);
    rendered = rendered.replace(/([^A-Za-z0-9])+/g, ",");
    return rendered
      .split(",")
      .map((x, index) => {
        x = x.replace(",", "");
        return index === 0 ? firstLower(x) : firstUpper(x);
      })
      .join("");
  };
};

export const toTypescript: MustacheFn = () => {
  return _toTypescript;
};

const _toTypescript = (
  value: string,
  render: (template: string) => string,
  undefinable = false
) => {
  let type = render(value);

  let optional = false;
  if (type[type.length - 1] === "!") {
    type = type.substring(0, type.length - 1);
  } else {
    optional = true;
  }

  if (type[0] === "[") {
    return toTypescriptArray(type, optional);
  }

  if (type.startsWith("Map<")) {
    return toTypescriptMap(type, optional);
  }

  switch (type) {
    case "JSON":
      type = "Types.Json";
      break;
    default:
      if (type.includes("Enum_")) {
        type = type.replace("Enum_", "");
      }
      type = detectKeyword()(type, (str) => str);
      type = `Types.${type}`;
  }

  return undefinable
    ? applyUndefinable(type, optional)
    : applyOptional(type, optional);
};

const toTypescriptArray = (type: string, optional: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z0-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const tsType = _toTypescript(result[2], (str) => str);
  return applyOptional("Array<" + tsType + ">", optional);
};

const toTypescriptMap = (type: string, optional: boolean): string => {
  const openAngleBracketIdx = type.indexOf("<");
  const closeAngleBracketIdx = type.lastIndexOf(">");

  const keyValTypes = type.substring(
    openAngleBracketIdx + 1,
    closeAngleBracketIdx
  );

  const firstCommaIdx = keyValTypes.indexOf(",");
  const keyType = keyValTypes.substring(0, firstCommaIdx).trim();
  const valType = keyValTypes.substring(firstCommaIdx + 1).trim();

  const tsKeyType = _toTypescript(keyType, (str) => str);
  const tsValType = _toTypescript(valType, (str) => str, true);

  return applyOptional(`Map<${tsKeyType}, ${tsValType}>`, optional);
};

const applyOptional = (type: string, optional: boolean): string => {
  if (optional) {
    return `${type} | null`;
  } else {
    return type;
  }
};

const applyUndefinable = (type: string, undefinable: boolean): string => {
  if (undefinable) {
    return `${type} | undefined`;
  } else {
    return type;
  }
};
