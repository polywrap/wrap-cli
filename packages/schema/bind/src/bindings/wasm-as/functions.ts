import { isBaseType } from "./types";

type MustacheFunction = () => (
  value: string,
  render: (template: string) => string
) => string;

export const toMsgPack: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let modifier = "";
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      modifier = "Nullable";
    }

    if (type[0] === "[") {
      return modifier + "Array";
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

export const toWasmInit: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      const nullType = toWasm()(value, render);
      const nullable = "Nullable";
      const nullOptional = "| null";

      if (nullType.substr(-nullOptional.length) === nullOptional) {
        return "null";
      } else if (nullType.substr(0, nullable.length) === nullable) {
        return `new ${nullType}()`;
      }
    }

    if (type[0] === "[") {
      return "[]";
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
        return "0";
      case "String":
        return `""`;
      case "Boolean":
        return "false";
      case "Bytes":
        return `new ArrayBuffer(0)`;
      default:
        return `new Objects.${type}()`;
    }
  };
};

export const toWasm: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);

    let nullable = false;
    if (type[type.length - 1] === "!") {
      type = type.substr(0, type.length - 1);
    } else {
      nullable = true;
    }

    if (type[0] === "[") {
      return toWasmArray(type, nullable);
    }

    switch (type) {
      case "Int":
        return applyNullable("i32", nullable);
      case "Int8":
        return applyNullable("i8", nullable);
      case "Int16":
        return applyNullable("i16", nullable);
      case "Int32":
        return applyNullable("i32", nullable);
      case "Int64":
        return applyNullable("i64", nullable);
      case "UInt":
        return applyNullable("u32", nullable);
      case "UInt8":
        return applyNullable("u8", nullable);
      case "UInt16":
        return applyNullable("u16", nullable);
      case "UInt32":
        return applyNullable("u32", nullable);
      case "UInt64":
        return applyNullable("u64", nullable);
      case "String":
        return applyNullable("string", nullable);
      case "Boolean":
        return applyNullable("bool", nullable);
      case "Bytes":
        return applyNullable("ArrayBuffer", nullable);
      default:
        return applyNullable("Objects." + type, nullable);
    }
  };
};

const toWasmArray = (type: string, nullable: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z1-9_!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const wasmType = toWasm()(result[2], (str) => str);
  return applyNullable("Array<" + wasmType + ">", nullable);
};

const applyNullable = (type: string, nullable: boolean): string => {
  if (nullable) {
    if (
      type.indexOf("Array") === 0 ||
      type.indexOf("string") === 0 ||
      !isBaseType(type)
    ) {
      return `${type} | null`;
    } else {
      return `Nullable<${type}>`;
    }
  } else {
    return type;
  }
};
