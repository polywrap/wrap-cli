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
import { SetDataOptions } from "./";
import * as Types from "..";

export function serializeSetDataOptions(type: SetDataOptions): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: SetDataOptions");
  const sizer = new WriteSizer(sizerContext);
  writeSetDataOptions(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: SetDataOptions");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeSetDataOptions(encoder, type);
  return buffer;
}

export function writeSetDataOptions(writer: Write, type: SetDataOptions): void {
  writer.writeMapLength(2);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(type.address);
  writer.context().pop();
  writer.context().push("value", "u32", "writing property");
  writer.writeString("value");
  writer.writeUInt32(type.value);
  writer.context().pop();
}

export function deserializeSetDataOptions(buffer: ArrayBuffer): SetDataOptions {
  const context: Context = new Context("Deserializing object-type SetDataOptions");
  const reader = new ReadDecoder(buffer, context);
  return readSetDataOptions(reader);
}

export function readSetDataOptions(reader: Read): SetDataOptions {
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _value: u32 = 0;
  let _valueSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "u32", "type found, reading property");
      _value = reader.readUInt32();
      _valueSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'address: String'"));
  }
  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'value: UInt32'"));
  }

  return {
    address: _address,
    value: _value
  };
}
