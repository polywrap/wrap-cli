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
import { Interface_InterfaceType } from "./";
import * as Types from "../..";

export function serializeInterface_InterfaceType(type: Interface_InterfaceType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Interface_InterfaceType");
  const sizer = new WriteSizer(sizerContext);
  writeInterface_InterfaceType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Interface_InterfaceType");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeInterface_InterfaceType(encoder, type);
  return buffer;
}

export function writeInterface_InterfaceType(writer: Write, type: Interface_InterfaceType): void {
  writer.writeMapLength(1);
  writer.context().push("uint8", "u8", "writing property");
  writer.writeString("uint8");
  writer.writeUInt8(type.uint8);
  writer.context().pop();
}

export function deserializeInterface_InterfaceType(buffer: ArrayBuffer): Interface_InterfaceType {
  const context: Context = new Context("Deserializing imported object-type Interface_InterfaceType");
  const reader = new ReadDecoder(buffer, context);
  return readInterface_InterfaceType(reader);
}

export function readInterface_InterfaceType(reader: Read): Interface_InterfaceType {
  let numFields = reader.readMapLength();

  let _uint8: u8 = 0;
  let _uint8Set: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "uint8") {
      reader.context().push(field, "u8", "type found, reading property");
      _uint8 = reader.readUInt8();
      _uint8Set = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_uint8Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'uint8: UInt8'"));
  }

  return {
    uint8: _uint8
  };
}
