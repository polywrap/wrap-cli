import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Box,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import { CustomMapValue } from "./";
import * as Types from "..";

export function serializeCustomMapValue(type: CustomMapValue): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: CustomMapValue");
  const sizer = new WriteSizer(sizerContext);
  writeCustomMapValue(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: CustomMapValue");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeCustomMapValue(encoder, type);
  return buffer;
}

export function writeCustomMapValue(writer: Write, type: CustomMapValue): void {
  writer.writeMapLength(1);
  writer.context().push("foo", "string", "writing property");
  writer.writeString("foo");
  writer.writeString(type.foo);
  writer.context().pop();
}

export function deserializeCustomMapValue(buffer: ArrayBuffer): CustomMapValue {
  const context: Context = new Context("Deserializing object-type CustomMapValue");
  const reader = new ReadDecoder(buffer, context);
  return readCustomMapValue(reader);
}

export function readCustomMapValue(reader: Read): CustomMapValue {
  let numFields = reader.readMapLength();

  let _foo: string = "";
  let _fooSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "foo") {
      reader.context().push(field, "string", "type found, reading property");
      _foo = reader.readString();
      _fooSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_fooSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'foo: String'"));
  }

  return {
    foo: _foo
  };
}
