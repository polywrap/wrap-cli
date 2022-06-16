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
import { Circular } from "./";
import * as Types from "..";

export function serializeCircular(type: Circular): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Circular");
  const sizer = new WriteSizer(sizerContext);
  writeCircular(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Circular");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeCircular(encoder, type);
  return buffer;
}

export function writeCircular(writer: Write, type: Circular): void {
  writer.writeMapLength(1);
  writer.context().push("prop", "string", "writing property");
  writer.writeString("prop");
  writer.writeString(type.prop);
  writer.context().pop();
}

export function deserializeCircular(buffer: ArrayBuffer): Circular {
  const context: Context = new Context("Deserializing object-type Circular");
  const reader = new ReadDecoder(buffer, context);
  return readCircular(reader);
}

export function readCircular(reader: Read): Circular {
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
