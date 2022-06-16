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
import { Ethereum_TxOverrides } from "./";
import * as Types from "../..";

export function serializeEthereum_TxOverrides(type: Ethereum_TxOverrides): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_TxOverrides");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_TxOverrides(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_TxOverrides");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_TxOverrides(encoder, type);
  return buffer;
}

export function writeEthereum_TxOverrides(writer: Write, type: Ethereum_TxOverrides): void {
  writer.writeMapLength(3);
  writer.context().push("gasLimit", "BigInt | null", "writing property");
  writer.writeString("gasLimit");
  writer.writeNullableBigInt(type.gasLimit);
  writer.context().pop();
  writer.context().push("gasPrice", "BigInt | null", "writing property");
  writer.writeString("gasPrice");
  writer.writeNullableBigInt(type.gasPrice);
  writer.context().pop();
  writer.context().push("value", "BigInt | null", "writing property");
  writer.writeString("value");
  writer.writeNullableBigInt(type.value);
  writer.context().pop();
}

export function deserializeEthereum_TxOverrides(buffer: ArrayBuffer): Ethereum_TxOverrides {
  const context: Context = new Context("Deserializing imported object-type Ethereum_TxOverrides");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_TxOverrides(reader);
}

export function readEthereum_TxOverrides(reader: Read): Ethereum_TxOverrides {
  let numFields = reader.readMapLength();

  let _gasLimit: BigInt | null = null;
  let _gasPrice: BigInt | null = null;
  let _value: BigInt | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "gasLimit") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _gasLimit = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "gasPrice") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _gasPrice = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _value = reader.readNullableBigInt();
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    gasLimit: _gasLimit,
    gasPrice: _gasPrice,
    value: _value
  };
}
