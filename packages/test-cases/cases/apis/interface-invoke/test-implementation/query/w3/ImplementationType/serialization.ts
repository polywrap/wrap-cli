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
import { ImplementationType } from "./";
import * as Types from "..";

export function serializeImplementationType(type: ImplementationType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: ImplementationType");
  const sizer = new WriteSizer(sizerContext);
  writeImplementationType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: ImplementationType");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeImplementationType(encoder, type);
  return buffer;
}

export function writeImplementationType(writer: Write, type: ImplementationType): void {
  writer.writeMapLength(2);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
  writer.context().push("uint8", "u8", "writing property");
  writer.writeString("uint8");
  writer.writeUInt8(type.uint8);
  writer.context().pop();
}

export function deserializeImplementationType(buffer: ArrayBuffer): ImplementationType {
  const context: Context = new Context("Deserializing object-type ImplementationType");
  const reader = new ReadDecoder(buffer, context);
  return readImplementationType(reader);
}

export function readImplementationType(reader: Read): ImplementationType {
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;
  let _uint8: u8 = 0;
  let _uint8Set: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string", "type found, reading property");
      _str = reader.readString();
      _strSet = true;
      reader.context().pop();
    }
    else if (field == "uint8") {
      reader.context().push(field, "u8", "type found, reading property");
      _uint8 = reader.readUInt8();
      _uint8Set = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'str: String'"));
  }
  if (!_uint8Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'uint8: UInt8'"));
  }

  return {
    str: _str,
    uint8: _uint8
  };
}
