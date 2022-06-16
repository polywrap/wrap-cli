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
import { Pair } from "./";
import * as Types from "..";

export function serializePair(type: Pair): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Pair");
  const sizer = new WriteSizer(sizerContext);
  writePair(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Pair");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writePair(encoder, type);
  return buffer;
}

export function writePair(writer: Write, type: Pair): void {
  writer.writeMapLength(2);
  writer.context().push("x", "i32", "writing property");
  writer.writeString("x");
  writer.writeInt32(type.x);
  writer.context().pop();
  writer.context().push("y", "i32", "writing property");
  writer.writeString("y");
  writer.writeInt32(type.y);
  writer.context().pop();
}

export function deserializePair(buffer: ArrayBuffer): Pair {
  const context: Context = new Context("Deserializing object-type Pair");
  const reader = new ReadDecoder(buffer, context);
  return readPair(reader);
}

export function readPair(reader: Read): Pair {
  let numFields = reader.readMapLength();

  let _x: i32 = 0;
  let _xSet: bool = false;
  let _y: i32 = 0;
  let _ySet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "x") {
      reader.context().push(field, "i32", "type found, reading property");
      _x = reader.readInt32();
      _xSet = true;
      reader.context().pop();
    }
    else if (field == "y") {
      reader.context().push(field, "i32", "type found, reading property");
      _y = reader.readInt32();
      _ySet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_xSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'x: Int'"));
  }
  if (!_ySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'y: Int'"));
  }

  return {
    x: _x,
    y: _y
  };
}
