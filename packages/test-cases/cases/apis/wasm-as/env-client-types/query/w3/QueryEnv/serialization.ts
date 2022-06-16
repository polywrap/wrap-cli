import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@web3api/wasm-as";
import { QueryEnv } from "./";
import * as Types from "..";

export function serializeQueryEnv(type: QueryEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: QueryEnv");
  const sizer = new WriteSizer(sizerContext);
  writeQueryEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: QueryEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeQueryEnv(encoder, type);
  return buffer;
}

export function writeQueryEnv(writer: Write, type: QueryEnv): void {
  writer.writeMapLength(3);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeNullableString(type.optStr);
  writer.context().pop();
  writer.context().push("defStr", "string", "writing property");
  writer.writeString("defStr");
  writer.writeString(type.defStr);
  writer.context().pop();
}

export function deserializeQueryEnv(buffer: ArrayBuffer): QueryEnv {
  const context: Context = new Context("Deserializing object-type QueryEnv");
  const reader = new ReadDecoder(buffer, context);
  return readQueryEnv(reader);
}

export function readQueryEnv(reader: Read): QueryEnv {
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;
  let _optStr: string | null = null;
  let _defStr: string = "";
  let _defStrSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string", "type found, reading property");
      _str = reader.readString();
      _strSet = true;
      reader.context().pop();
    }
    else if (field == "optStr") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optStr = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "defStr") {
      reader.context().push(field, "string", "type found, reading property");
      _defStr = reader.readString();
      _defStrSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'str: String'"));
  }
  if (!_defStrSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'defStr: String'"));
  }

  return {
    str: _str,
    optStr: _optStr,
    defStr: _defStr
  };
}
