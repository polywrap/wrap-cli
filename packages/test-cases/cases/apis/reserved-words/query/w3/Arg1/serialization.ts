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
import { Arg1 } from "./";
import * as Types from "..";

export function serializeArg1(type: Arg1): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Arg1");
  const sizer = new WriteSizer(sizerContext);
  writeArg1(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Arg1");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeArg1(encoder, type);
  return buffer;
}

export function writeArg1(writer: Write, type: Arg1): void {
  writer.writeMapLength(1);
  writer.context().push("const", "string", "writing property");
  writer.writeString("const");
  writer.writeString(type.m_const);
  writer.context().pop();
}

export function deserializeArg1(buffer: ArrayBuffer): Arg1 {
  const context: Context = new Context("Deserializing object-type Arg1");
  const reader = new ReadDecoder(buffer, context);
  return readArg1(reader);
}

export function readArg1(reader: Read): Arg1 {
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
