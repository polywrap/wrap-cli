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

  let nullable = false;
  if (type[type.length - 1] === "!") {
    type = type.substring(0, type.length - 1);
  } else {
    nullable = true;
  }

  if (type[0] === "[") {
    return toTypescriptArray(type, nullable);
  }

  if (type.startsWith("Map<")) {
    return toTypescriptMap(type, nullable);
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
    ? applyUndefinable(type, nullable)
    : applyNullable(type, nullable);
};

const toTypescriptArray = (type: string, nullable: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z0-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const tsType = _toTypescript(result[2], (str) => str);
  return applyNullable("Array<" + tsType + ">", nullable);
};

const toTypescriptMap = (type: string, nullable: boolean): string => {
  const openAngleBracketIdx = type.indexOf("<");
  const closeAngleBracketIdx = type.lastIndexOf(">");

  const [keyType, valtype] = type
    .substring(openAngleBracketIdx + 1, closeAngleBracketIdx)
    .split(",")
    .map((x) => x.trim());

  const tsKeyType = _toTypescript(keyType, (str) => str);
  const tsValType = _toTypescript(valtype, (str) => str, true);

  return applyNullable(`Map<${tsKeyType}, ${tsValType}>`, nullable);
};

const applyNullable = (type: string, nullable: boolean): string => {
  if (nullable) {
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
