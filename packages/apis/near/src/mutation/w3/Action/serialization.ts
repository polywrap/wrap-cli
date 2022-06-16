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
import { Action } from "./";
import * as Types from "..";

export function serializeAction(type: Action): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Action");
  const sizer = new WriteSizer(sizerContext);
  writeAction(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Action");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeAction(encoder, type);
  return buffer;
}

export function writeAction(writer: Write, type: Action): void {
  writer.writeMapLength(0);
}

export function deserializeAction(buffer: ArrayBuffer): Action {
  const context: Context = new Context("Deserializing object-type Action");
  const reader = new ReadDecoder(buffer, context);
  return readAction(reader);
}

export function readAction(reader: Read): Action {
  let numFields = reader.readMapLength();


  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    reader.context().pop();
  }


  return {
  };
}
