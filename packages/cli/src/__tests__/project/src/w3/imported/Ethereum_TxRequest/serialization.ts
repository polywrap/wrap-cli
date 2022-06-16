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
import { Ethereum_TxRequest } from "./";
import * as Types from "../..";

export function serializeEthereum_TxRequest(type: Ethereum_TxRequest): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_TxRequest");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_TxRequest(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_TxRequest");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_TxRequest(encoder, type);
  return buffer;
}

export function writeEthereum_TxRequest(writer: Write, type: Ethereum_TxRequest): void {
  writer.writeMapLength(9);
  writer.context().push("to", "string | null", "writing property");
  writer.writeString("to");
  writer.writeNullableString(type.to);
  writer.context().pop();
  writer.context().push("from", "string | null", "writing property");
  writer.writeString("from");
  writer.writeNullableString(type.m_from);
  writer.context().pop();
  writer.context().push("nonce", "Nullable<u32>", "writing property");
  writer.writeString("nonce");
  writer.writeNullableUInt32(type.nonce);
  writer.context().pop();
  writer.context().push("gasLimit", "BigInt | null", "writing property");
  writer.writeString("gasLimit");
  writer.writeNullableBigInt(type.gasLimit);
  writer.context().pop();
  writer.context().push("gasPrice", "BigInt | null", "writing property");
  writer.writeString("gasPrice");
  writer.writeNullableBigInt(type.gasPrice);
  writer.context().pop();
  writer.context().push("data", "string | null", "writing property");
  writer.writeString("data");
  writer.writeNullableString(type.data);
  writer.context().pop();
  writer.context().push("value", "BigInt | null", "writing property");
  writer.writeString("value");
  writer.writeNullableBigInt(type.value);
  writer.context().pop();
  writer.context().push("chainId", "BigInt | null", "writing property");
  writer.writeString("chainId");
  writer.writeNullableBigInt(type.chainId);
  writer.context().pop();
  writer.context().push("type", "Nullable<u32>", "writing property");
  writer.writeString("type");
  writer.writeNullableUInt32(type.m_type);
  writer.context().pop();
}

export function deserializeEthereum_TxRequest(buffer: ArrayBuffer): Ethereum_TxRequest {
  const context: Context = new Context("Deserializing imported object-type Ethereum_TxRequest");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_TxRequest(reader);
}

export function readEthereum_TxRequest(reader: Read): Ethereum_TxRequest {
  let numFields = reader.readMapLength();

  let _to: string | null = null;
  let _from: string | null = null;
  let _nonce: Nullable<u32> = new Nullable<u32>();
  let _gasLimit: BigInt | null = null;
  let _gasPrice: BigInt | null = null;
  let _data: string | null = null;
  let _value: BigInt | null = null;
  let _chainId: BigInt | null = null;
  let _type: Nullable<u32> = new Nullable<u32>();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "to") {
      reader.context().push(field, "string | null", "type found, reading property");
      _to = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "from") {
      reader.context().push(field, "string | null", "type found, reading property");
      _from = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "nonce") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _nonce = reader.readNullableUInt32();
      reader.context().pop();
    }
    else if (field == "gasLimit") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _gasLimit = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "gasPrice") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _gasPrice = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "data") {
      reader.context().push(field, "string | null", "type found, reading property");
      _data = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _value = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "chainId") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _chainId = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "type") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _type = reader.readNullableUInt32();
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    to: _to,
    m_from: _from,
    nonce: _nonce,
    gasLimit: _gasLimit,
    gasPrice: _gasPrice,
    data: _data,
    value: _value,
    chainId: _chainId,
    m_type: _type
  };
}
