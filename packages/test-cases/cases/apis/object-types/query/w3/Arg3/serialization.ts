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
import { Arg3 } from "./";
import * as Types from "..";

export function serializeArg3(type: Arg3): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Arg3");
  const sizer = new WriteSizer(sizerContext);
  writeArg3(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Arg3");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeArg3(encoder, type);
  return buffer;
}

export function writeArg3(writer: Write, type: Arg3): void {
  writer.writeMapLength(1);
  writer.context().push("prop", "ArrayBuffer", "writing property");
  writer.writeString("prop");
  writer.writeBytes(type.prop);
  writer.context().pop();
}

export function deserializeArg3(buffer: ArrayBuffer): Arg3 {
  const context: Context = new Context("Deserializing object-type Arg3");
  const reader = new ReadDecoder(buffer, context);
  return readArg3(reader);
}

export function readArg3(reader: Read): Arg3 {
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
