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
import { PublicKey } from "./";
import * as Types from "..";

export function serializePublicKey(type: PublicKey): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: PublicKey");
  const sizer = new WriteSizer(sizerContext);
  writePublicKey(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: PublicKey");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writePublicKey(encoder, type);
  return buffer;
}

export function writePublicKey(writer: Write, type: PublicKey): void {
  writer.writeMapLength(2);
  writer.context().push("keyType", "Types.KeyType", "writing property");
  writer.writeString("keyType");
  writer.writeInt32(type.keyType);
  writer.context().pop();
  writer.context().push("data", "ArrayBuffer", "writing property");
  writer.writeString("data");
  writer.writeBytes(type.data);
  writer.context().pop();
}

export function deserializePublicKey(buffer: ArrayBuffer): PublicKey {
  const context: Context = new Context("Deserializing object-type PublicKey");
  const reader = new ReadDecoder(buffer, context);
  return readPublicKey(reader);
}

export function readPublicKey(reader: Read): PublicKey {
  let numFields = reader.readMapLength();

  let _keyType: Types.KeyType = 0;
  let _keyTypeSet: bool = false;
  let _data: ArrayBuffer = new ArrayBuffer(0);
  let _dataSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "keyType") {
      reader.context().push(field, "Types.KeyType", "type found, reading property");
      let value: Types.KeyType;
      if (reader.isNextString()) {
        value = Types.getKeyTypeValue(reader.readString());
      } else {
        value = reader.readInt32();
        Types.sanitizeKeyTypeValue(value);
      }
      _keyType = value;
      _keyTypeSet = true;
      reader.context().pop();
    }
    else if (field == "data") {
      reader.context().push(field, "ArrayBuffer", "type found, reading property");
      _data = reader.readBytes();
      _dataSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_keyTypeSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'keyType: KeyType'"));
  }
  if (!_dataSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'data: Bytes'"));
  }

  return {
    keyType: _keyType,
    data: _data
  };
}
