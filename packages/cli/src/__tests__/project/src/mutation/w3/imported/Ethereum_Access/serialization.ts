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
import { Ethereum_Access } from "./";
import * as Types from "../..";

export function serializeEthereum_Access(type: Ethereum_Access): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_Access");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_Access(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_Access");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_Access(encoder, type);
  return buffer;
}

export function writeEthereum_Access(writer: Write, type: Ethereum_Access): void {
  writer.writeMapLength(2);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(type.address);
  writer.context().pop();
  writer.context().push("storageKeys", "Array<string>", "writing property");
  writer.writeString("storageKeys");
  writer.writeArray(type.storageKeys, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializeEthereum_Access(buffer: ArrayBuffer): Ethereum_Access {
  const context: Context = new Context("Deserializing imported object-type Ethereum_Access");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_Access(reader);
}

export function readEthereum_Access(reader: Read): Ethereum_Access {
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _storageKeys: Array<string> = [];
  let _storageKeysSet: bool = false;

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
    else if (field == "storageKeys") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _storageKeys = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _storageKeysSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'address: String'"));
  }
  if (!_storageKeysSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'storageKeys: [String]'"));
  }

  return {
    address: _address,
    storageKeys: _storageKeys
  };
}
