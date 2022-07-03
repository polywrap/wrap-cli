import { MustacheFn } from "../types";

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
    rendered.replace(/([^A-Za-z0-9])+/g, ",");
    return rendered
      .split(",")
      .map((x) => (x ? firstUpper(x.replace(",", "")) : ""))
      .join();
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
      .join();
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

  if (type.startsWith("Fraction<")) {
    return toTypescriptFraction(type, optional);
  }

  switch (type) {
    case "JSON":
      type = "Types.Json";
      break;
    default:
      if (type.includes("Enum_")) {
        type = `Types.${type.replace("Enum_", "")}`;
      } else {
        type = `Types.${type}`;
      }
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

  const [keyType, valtype] = type
    .substring(openAngleBracketIdx + 1, closeAngleBracketIdx)
    .split(",")
    .map((x) => x.trim());

  const tsKeyType = _toTypescript(keyType, (str) => str);
  const tsValType = _toTypescript(valtype, (str) => str, true);

  return applyOptional(`Map<${tsKeyType}, ${tsValType}>`, optional);
};

const toTypescriptFraction = (type: string, optional: boolean): string => {
  const result = type.match(
    /Fraction<(Int|Int8|Int16|Int32|UInt|UInt8|UInt16|UInt32)!>/
  );

  if (!result || result.length !== 2) {
    throw Error(`Invalid Fraction: ${type}`);
  }

  const tsType = _toTypescript(result[1] + "!", (str) => str);
  return applyOptional("Types.Fraction<" + tsType + ">", optional);
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
