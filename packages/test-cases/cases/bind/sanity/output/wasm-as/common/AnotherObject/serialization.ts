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
import { AnotherObject } from "./";
import * as Types from "..";

export function serializeAnotherObject(type: AnotherObject): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: AnotherObject");
  const sizer = new WriteSizer(sizerContext);
  writeAnotherObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: AnotherObject");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeAnotherObject(encoder, type);
  return buffer;
}

export function writeAnotherObject(writer: Write, type: AnotherObject): void {
  writer.writeMapLength(1);
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
}

export function deserializeAnotherObject(buffer: ArrayBuffer): AnotherObject {
  const context: Context = new Context("Deserializing object-type AnotherObject");
  const reader = new ReadDecoder(buffer, context);
  return readAnotherObject(reader);
}

export function readAnotherObject(reader: Read): AnotherObject {
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
