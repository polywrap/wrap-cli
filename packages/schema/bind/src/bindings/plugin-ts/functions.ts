import { MustacheFunction } from "../types";

export const toTypescript: MustacheFunction = () => {
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

  if (type.startsWith("Map")) {
    return toTypescriptMap(type, nullable);
  }

  switch (type) {
    case "Int":
    case "Int8":
    case "Int16":
    case "Int32":
    case "UInt":
    case "UInt32":
    case "UInt8":
    case "UInt16":
    case "String":
    case "Boolean":
    case "Bytes":
    case "BigInt":
      break;
    case "JSON":
      type = "Json";
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
  const result = type.match(/(\[)([[\]A-Za-z1-9_.!]+)(\])/);

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
