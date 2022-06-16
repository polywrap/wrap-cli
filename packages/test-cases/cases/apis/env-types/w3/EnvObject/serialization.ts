import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import { EnvObject } from "./";
import * as Types from "..";

export function serializeEnvObject(type: EnvObject): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: EnvObject");
  const sizer = new WriteSizer(sizerContext);
  writeEnvObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: EnvObject");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEnvObject(encoder, type);
  return buffer;
}

export function writeEnvObject(writer: Write, type: EnvObject): void {
  writer.writeMapLength(1);
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
}

export function deserializeEnvObject(buffer: ArrayBuffer): EnvObject {
  const context: Context = new Context("Deserializing object-type EnvObject");
  const reader = new ReadDecoder(buffer, context);
  return readEnvObject(reader);
}

export function readEnvObject(reader: Read): EnvObject {
  let numFields = reader.readMapLength();

  let _prop: string = "";
  let _propSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop") {
      reader.context().push(field, "string", "type found, reading property");
      _prop = reader.readString();
      _propSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: String'"));
  }

  return {
    prop: _prop
  };
}
