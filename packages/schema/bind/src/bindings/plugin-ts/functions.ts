import { MustacheFunction } from "../types";

export const toTypescript: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

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

    return applyNullable(type, nullable);
  };
};

const toTypescriptArray = (type: string, nullable: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z1-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const tsType = toTypescript()(result[2], (str) => str);
  return applyNullable("Array<" + tsType + ">", nullable);
};

const applyNullable = (type: string, nullable: boolean): string => {
  if (nullable) {
    return `${type} | null`;
  } else {
    return type;
  }
};
