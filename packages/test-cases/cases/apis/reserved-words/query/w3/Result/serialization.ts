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
import { Result } from "./";
import * as Types from "..";

export function serializeResult(type: Result): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Result");
  const sizer = new WriteSizer(sizerContext);
  writeResult(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Result");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeResult(encoder, type);
  return buffer;
}

export function writeResult(writer: Write, type: Result): void {
  writer.writeMapLength(1);
  writer.context().push("const", "string", "writing property");
  writer.writeString("const");
  writer.writeString(type.m_const);
  writer.context().pop();
}

export function deserializeResult(buffer: ArrayBuffer): Result {
  const context: Context = new Context("Deserializing object-type Result");
  const reader = new ReadDecoder(buffer, context);
  return readResult(reader);
}

export function readResult(reader: Read): Result {
  let numFields = reader.readMapLength();

  let _const: string = "";
  let _constSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "const") {
      reader.context().push(field, "string", "type found, reading property");
      _const = reader.readString();
      _constSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_constSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'const: String'"));
  }

  return {
    m_const: _const
  };
}
