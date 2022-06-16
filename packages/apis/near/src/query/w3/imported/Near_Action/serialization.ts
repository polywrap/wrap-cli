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
import { Near_Action } from "./";
import * as Types from "../..";

export function serializeNear_Action(type: Near_Action): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Near_Action");
  const sizer = new WriteSizer(sizerContext);
  writeNear_Action(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Near_Action");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeNear_Action(encoder, type);
  return buffer;
}

export function writeNear_Action(writer: Write, type: Near_Action): void {
  writer.writeMapLength(1);
  writer.context().push("_", "string | null", "writing property");
  writer.writeString("_");
  writer.writeNullableString(type._);
  writer.context().pop();
}

export function deserializeNear_Action(buffer: ArrayBuffer): Near_Action {
  const context: Context = new Context("Deserializing imported object-type Near_Action");
  const reader = new ReadDecoder(buffer, context);
  return readNear_Action(reader);
}

export function readNear_Action(reader: Read): Near_Action {
  let numFields = reader.readMapLength();

  let __: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "_") {
      reader.context().push(field, "string | null", "type found, reading property");
      __ = reader.readNullableString();
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    _: __
  };
}
