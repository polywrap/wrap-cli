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
} from "@polywrap/wasm-as";
import { _else } from "./";
import * as Types from "..";

export function serializeelse(type: _else): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: else");
  const sizer = new WriteSizer(sizerContext);
  writeelse(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: else");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeelse(encoder, type);
  return buffer;
}

export function writeelse(writer: Write, type: _else): void {
  writer.writeMapLength(1);
  writer.context().push("else", "string", "writing property");
  writer.writeString("else");
  writer.writeString(type._else);
  writer.context().pop();
}

export function deserializeelse(buffer: ArrayBuffer): _else {
  const context: Context = new Context("Deserializing object-type else");
  const reader = new ReadDecoder(buffer, context);
  return readelse(reader);
}

export function readelse(reader: Read): _else {
  let numFields = reader.readMapLength();

  let _else: string = "";
  let _elseSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "else") {
      reader.context().push(field, "string", "type found, reading property");
      _else = reader.readString();
      _elseSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_elseSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'else: String'"));
  }

  return {
    _else: _else
  };
}
