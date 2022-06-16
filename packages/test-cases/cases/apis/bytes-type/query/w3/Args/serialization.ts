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
import { Args } from "./";
import * as Types from "..";

export function serializeArgs(type: Args): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Args");
  const sizer = new WriteSizer(sizerContext);
  writeArgs(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Args");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeArgs(encoder, type);
  return buffer;
}

export function writeArgs(writer: Write, type: Args): void {
  writer.writeMapLength(1);
  writer.context().push("prop", "ArrayBuffer", "writing property");
  writer.writeString("prop");
  writer.writeBytes(type.prop);
  writer.context().pop();
}

export function deserializeArgs(buffer: ArrayBuffer): Args {
  const context: Context = new Context("Deserializing object-type Args");
  const reader = new ReadDecoder(buffer, context);
  return readArgs(reader);
}

export function readArgs(reader: Read): Args {
  let numFields = reader.readMapLength();

  let _prop: ArrayBuffer = new ArrayBuffer(0);
  let _propSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop") {
      reader.context().push(field, "ArrayBuffer", "type found, reading property");
      _prop = reader.readBytes();
      _propSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'prop: Bytes'"));
  }

  return {
    prop: _prop
  };
}
