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
import { Ethereum_Network } from "./";
import * as Types from "../..";

export function serializeEthereum_Network(type: Ethereum_Network): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_Network");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_Network(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_Network");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_Network(encoder, type);
  return buffer;
}

export function writeEthereum_Network(writer: Write, type: Ethereum_Network): void {
  writer.writeMapLength(3);
  writer.context().push("name", "string", "writing property");
  writer.writeString("name");
  writer.writeString(type.name);
  writer.context().pop();
  writer.context().push("chainId", "BigInt", "writing property");
  writer.writeString("chainId");
  writer.writeBigInt(type.chainId);
  writer.context().pop();
  writer.context().push("ensAddress", "string | null", "writing property");
  writer.writeString("ensAddress");
  writer.writeNullableString(type.ensAddress);
  writer.context().pop();
}

export function deserializeEthereum_Network(buffer: ArrayBuffer): Ethereum_Network {
  const context: Context = new Context("Deserializing imported object-type Ethereum_Network");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_Network(reader);
}

export function readEthereum_Network(reader: Read): Ethereum_Network {
  let numFields = reader.readMapLength();

  let _name: string = "";
  let _nameSet: bool = false;
  let _chainId: BigInt = BigInt.fromUInt16(0);
  let _chainIdSet: bool = false;
  let _ensAddress: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "name") {
      reader.context().push(field, "string", "type found, reading property");
      _name = reader.readString();
      _nameSet = true;
      reader.context().pop();
    }
    else if (field == "chainId") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _chainId = reader.readBigInt();
      _chainIdSet = true;
      reader.context().pop();
    }
    else if (field == "ensAddress") {
      reader.context().push(field, "string | null", "type found, reading property");
      _ensAddress = reader.readNullableString();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_nameSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'name: String'"));
  }
  if (!_chainIdSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'chainId: BigInt'"));
  }

  return {
    name: _name,
    chainId: _chainId,
    ensAddress: _ensAddress
  };
}
