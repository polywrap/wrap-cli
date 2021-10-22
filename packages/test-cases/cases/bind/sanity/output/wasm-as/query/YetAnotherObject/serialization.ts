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
import { YetAnotherObject } from "./";
import * as Types from "..";

export function serializeYetAnotherObject(type: YetAnotherObject): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: YetAnotherObject");
  const sizer = new WriteSizer(sizerContext);
  writeYetAnotherObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: YetAnotherObject");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeYetAnotherObject(encoder, type);
  return buffer;
}

export function writeYetAnotherObject(writer: Write, type: YetAnotherObject): void {
  writer.writeMapLength(2);
  writer.context().push("prop", "boolean", "writing property");
  writer.writeString("prop");
  writer.writeBool(type.prop);
  writer.context().pop();
}

export function deserializeYetAnotherObject(buffer: ArrayBuffer): YetAnotherObject {
  const context: Context = new Context("Deserializing object-type YetAnotherObject");
  const reader = new ReadDecoder(buffer, context);
  return readYetAnotherObject(reader);
}

export function readYetAnotherObject(reader: Read): YetAnotherObject {
  let numFields = reader.readMapLength();

  let _prop: boolean = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop") {
      reader.context().push(field, "boolean", "type found, reading property");
      _prop = reader.readBool();
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    prop: _prop,
  };
}
