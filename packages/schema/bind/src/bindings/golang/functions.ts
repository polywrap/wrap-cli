import { reservedWordsAS } from "./reservedWords";
import { MustacheFn } from "../types";

let num = -1;

export const startIter: MustacheFn = () => {
  return (): string => {
    num = -1;
    return "";
  };
};

export const stopIter: MustacheFn = () => {
  return (): string => {
    num = -1;
    return "";
  };
};

export const currIter: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const rendered: string = render(text);
    return `${rendered}${num}`;
  };
};

export const nextIter: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const rendered: string = render(text);
    return `${rendered}${++num}`;
  };
};

export const prevFullIter: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const rendered: string = render(text);
    if (rendered == "stop") {
      return "";
    }
    return Array(num)
      .fill(0)
      .map((_, i) => `[${rendered}${i}]`)
      .join("");
  };
};

export const lastFullIter: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const rendered: string = render(text);
    if (rendered == "stop") {
      return "";
    }
    return Array(num + 1)
      .fill(0)
      .map((_, i) => `[${rendered}${i}]`)
      .join("");
  };
};

export const writePointer: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const [type, value] = render(text).split(" - ");
    let pointer = "*";
    switch (type) {
      case "BigInt":
      case "Json":
      case "Bytes":
        pointer = "";
        break;
    }
    return `writer.Write${type}(${pointer}${value})`;
  };
};

export const readPointer: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const [type, value] = render(text).split(" - ");
    let pointer = "&";
    switch (type) {
      case "BigInt":
      case "Json":
      case "Bytes":
        pointer = "";
        break;
    }
    return `${pointer}${value}`;
  };
};

export const toSnakeCase: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    text = render(text).replace(/([A-Z])/g, "_$1");
    text = text.startsWith("_") ? text.slice(1) : text;
    return text.toLowerCase();
  };
};

export const makeImports: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const types = render(text).split(",");
    const exist: { [key: string]: boolean } = {};
    for (let t of types) {
      t = t.trim();
      if (t.endsWith("big.Int")) {
        exist[
          "github.com/polywrap/go-wrap/polywrap/msgpack/big"
        ] = true;
      } else if (t.endsWith("fastjson.Value")) {
        exist["github.com/valyala/fastjson"] = true;
      } else if (/([^/\s]+\/)(.*)/.test(t)) {
        exist[t] = true;
      }
    }
    const imports: Array<string> = [];
    imports.push(...Object.keys(exist));
    const txt = imports
      .sort()
      .map((imp) => {
        let res = "";
        if (imp.startsWith(". ")) {
          res = `. "${imp.slice(2)}"`;
        } else {
          const parts = imp.split(" as ");
          if (parts.length > 1) {
            res = `${parts[1]} "${parts[0]}"`;
          } else {
            res = `"${imp}"`;
          }
        }
        return `\t${res}`;
      })
      .join("\n");
    return txt !== "" ? `\nimport (\n${txt}\n)\n\n` : "\n";
  };
};

export const stuctProps: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const props: [string, string][] = render(text)
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line !== "")
      .map((line) => line.split(" ") as [string, string]);
    let maxPropNameLn = 0;
    for (const [propName] of props) {
      if (propName.length > maxPropNameLn) {
        maxPropNameLn = propName.length;
      }
    }
    for (let i = 0; i < props.length; i++) {
      if (props[i][0].length < maxPropNameLn) {
        props[i][0] += Array(maxPropNameLn - props[i][0].length)
          .fill(" ")
          .join("");
      }
      props[i][0] = "\t" + props[i][0];
    }
    return props.map((v) => v.join(" ")).join("\n") + "\n";
  };
};

export const handleKeywords: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const rendered: string = render(text);
    if (reservedWordsAS.has(rendered)) {
      return "m_" + rendered;
    }
    return rendered;
  };
};

export const toMsgPack: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);
    if (type[type.length - 1] === "!") {
      type = type.substring(0, type.length - 1);
    }
    let t = type;
    if (type.startsWith("[")) {
      t = "Array";
    } else if (type.startsWith("Map")) {
      t = "Map";
    } else if (type.startsWith("Int8")) {
      t = "I8";
    } else if (type.startsWith("Int16")) {
      t = "I16";
    } else if (type.startsWith("Int32")) {
      t = "I32";
    } else if (type.startsWith("Int64")) {
      t = "I64";
    } else if (type.startsWith("Int")) {
      t = "I32";
    } else if (type.startsWith("UInt8")) {
      t = "U8";
    } else if (type.startsWith("UInt16")) {
      t = "U16";
    } else if (type.startsWith("UInt32")) {
      t = "U32";
    } else if (type.startsWith("UInt64")) {
      t = "U64";
    } else if (type.startsWith("UInt")) {
      t = "U32";
    } else if (type.startsWith("String")) {
      t = "String";
    } else if (type.startsWith("Boolean")) {
      t = "Bool";
    } else if (type.startsWith("Bytes")) {
      t = "Bytes";
    } else if (type.startsWith("BigInt")) {
      t = "BigInt";
    } else if (type.startsWith("BigNumber")) {
      t = "BigInt";
    } else if (type.startsWith("JSON")) {
      t = "Json";
    }
    return t;
  };
};

export const toWasm: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    let type = render(value);
    let isEnum = false;

    let optional = false;
    if (type[type.length - 1] === "!") {
      type = type.substring(0, type.length - 1);
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
        type = "int32";
        break;
      case "Int8":
        type = "int8";
        break;
      case "Int16":
        type = "int16";
        break;
      case "Int32":
        type = "int32";
        break;
      case "Int64":
        type = "int64";
        break;
      case "UInt":
        type = "uint32";
        break;
      case "UInt8":
        type = "uint8";
        break;
      case "UInt16":
        type = "uint16";
        break;
      case "UInt32":
        type = "uint32";
        break;
      case "UInt64":
        type = "uint64";
        break;
      case "String":
        type = "string";
        break;
      case "Boolean":
        type = "bool";
        break;
      case "Bytes":
        type = "[]byte";
        break;
      case "BigInt":
        type = "*big.Int";
        break;
      case "BigNumber":
        type = "*big.Int";
        break;
      case "JSON":
        type = "*fastjson.Value";
        break;
      default:
        if (type.includes("Enum_")) {
          type = `${type.replace("Enum_", "")}`;
          isEnum = true;
        } else {
          type = type.charAt(0).toUpperCase() + type.slice(1);
        }
    }

    return applyOptional(type, optional, isEnum);
  };
};

const toWasmArray = (type: string, optional: boolean): string => {
  const result = type.match(/(\[)([[\]A-Za-z0-9_.!]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${type}`);
  }

  const wasmType = toWasm()(result[2], (str) => str);
  return applyOptional(`[]${wasmType}`, optional, false);
};

const toWasmMap = (type: string, optional: boolean): string => {
  const firstOpenBracketIdx = type.indexOf("<");
  const lastCloseBracketIdx = type.lastIndexOf(">");

  if (!(firstOpenBracketIdx !== -1 && lastCloseBracketIdx !== -1)) {
    throw new Error(`Invalid Map: ${type}`);
  }

  const keyValTypes = type
    .substring(firstOpenBracketIdx + 1, lastCloseBracketIdx)
    .split(",");

  if (keyValTypes.length < 2) {
    throw new Error(`Invalid Map: ${type}`);
  }

  const keyType = toWasm()(keyValTypes[0].trim(), (str) => str);
  const valType = toWasm()(keyValTypes.slice(1).join(",").trim(), (str) => str);

  return applyOptional(`map[${keyType}]${valType}`, optional, false);
};

const applyOptional = (type: string, optional: boolean, _: boolean): string => {
  if (
    optional &&
    !type.startsWith("*") &&
    !type.startsWith("[]") &&
    !type.startsWith("map")
  ) {
    return `*${type}`;
  } else {
    return type;
  }
};

export const toLower: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    return render(value)
      .split("")
      .map((v) => v.toLowerCase())
      .join("");
  };
};

export const toFirstLower: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    const type = render(value);
    return type.charAt(0).toLowerCase() + type.slice(1);
  };
};

export const toUpper: MustacheFn = () => {
  return (value: string, render: (template: string) => string) => {
    const type = render(value);
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
};

export const pkgName: MustacheFn = () => {
  return (text: string, render: (template: string) => string): string => {
    const name = render(text);
    return reservedWordsAS.has(name) ? `pkg${name}` : name;
  };
};
