type MustacheFunction = () => (
  value: string,
  render: (template: string) => string
) => string;

export const toMsgPack: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let name = render(value);
    let modifier = "";
    if (name[0] === "?") {
      name = name.substr(1);
      modifier = "Nullable";
    }
    if (name[0] === "[") {
      return modifier + "Array";
    }
    switch (name) {
      case "Int":
        return modifier + "Int32";
      case "UInt":
        return modifier + "UInt32";
      default:
        return modifier + name;
    }
  };
};

export const toWasmInit: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let name = render(value);

    if (name[0] === "?") {
      const nullType = toWasm()(value, render);
      const nullable = "Nullable";

      if (nullType.substr(0, nullable.length) === nullable) {
        return `new ${nullType}()`;
      }
    }

    if (name[0] === "[") {
      return "[]";
    }

    switch (name) {
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
      default:
        return `new ${name}()`;
    }
  };
};

export const toWasm: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let name = render(value);

    let nullable = false;

    if (name[0] === "?") {
      name = name.substr(1);
      nullable = true;
    }

    if (name[0] === "[") {
      return toWasmArray(name, nullable);
    }

    switch (name) {
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
      default:
        return applyNullable(name, nullable);
    }
  };
};

const toWasmArray = (name: string, nullable: boolean): string => {
  const result = name.match(/(\[)([?[\]A-Za-z1-9]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${name}`);
  }

  const wasmType = toWasm()(result[2], (str) => str);
  return applyNullable("Array<" + wasmType + ">", nullable);
};

const applyNullable = (name: string, nullable: boolean): string => {
  if (nullable) {
    if (name.indexOf("Array") === 0 || name.indexOf("string") === 0) {
      return `${name} | null`;
    } else {
      return `Nullable<${name}>`;
    }
  } else {
    return name;
  }
};
