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
  writer.writeMapLength(2);
  writer.context().push("str", "string | null", "writing property");
  writer.writeString("str");
  writer.writeNullableString(type.str);
  writer.context().pop();
  writer.context().push("requiredInt", "i32", "writing property");
  writer.writeString("requiredInt");
  writer.writeInt32(type.requiredInt);
  writer.context().pop();
}

export function deserializeQueryEnv(buffer: ArrayBuffer): QueryEnv {
  const context: Context = new Context("Deserializing object-type QueryEnv");
  const reader = new ReadDecoder(buffer, context);
  return readQueryEnv(reader);
}

export function readQueryEnv(reader: Read): QueryEnv {
  let numFields = reader.readMapLength();

  let _str: string | null = null;
  let _requiredInt: i32 = 0;
  let _requiredIntSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string | null", "type found, reading property");
      _str = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "requiredInt") {
      reader.context().push(field, "i32", "type found, reading property");
      _requiredInt = reader.readInt32();
      _requiredIntSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_requiredIntSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'requiredInt: Int'"));
  }

  return {
    str: _str,
    requiredInt: _requiredInt
  };
}
