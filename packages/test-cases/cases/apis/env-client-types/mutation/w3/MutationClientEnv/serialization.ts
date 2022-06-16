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
import { MutationClientEnv } from "./";
import * as Types from "..";

export function serializeMutationClientEnv(type: MutationClientEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: MutationClientEnv");
  const sizer = new WriteSizer(sizerContext);
  writeMutationClientEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: MutationClientEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeMutationClientEnv(encoder, type);
  return buffer;
}

export function writeMutationClientEnv(writer: Write, type: MutationClientEnv): void {
  writer.writeMapLength(2);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeNullableString(type.optStr);
  writer.context().pop();
}

export function deserializeMutationClientEnv(buffer: ArrayBuffer): MutationClientEnv {
  const context: Context = new Context("Deserializing object-type MutationClientEnv");
  const reader = new ReadDecoder(buffer, context);
  return readMutationClientEnv(reader);
}

export function readMutationClientEnv(reader: Read): MutationClientEnv {
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;
  let _optStr: string | null = null;

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
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'str: String'"));
  }

  return {
    str: _str,
    optStr: _optStr
  };
}
