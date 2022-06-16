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
import { Ethereum_TxResponse } from "./";
import * as Types from "../..";

export function serializeEthereum_TxResponse(type: Ethereum_TxResponse): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_TxResponse");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_TxResponse(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_TxResponse");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_TxResponse(encoder, type);
  return buffer;
}

export function writeEthereum_TxResponse(writer: Write, type: Ethereum_TxResponse): void {
  writer.writeMapLength(19);
  writer.context().push("hash", "string", "writing property");
  writer.writeString("hash");
  writer.writeString(type.hash);
  writer.context().pop();
  writer.context().push("to", "string | null", "writing property");
  writer.writeString("to");
  writer.writeNullableString(type.to);
  writer.context().pop();
  writer.context().push("from", "string", "writing property");
  writer.writeString("from");
  writer.writeString(type.m_from);
  writer.context().pop();
  writer.context().push("nonce", "u32", "writing property");
  writer.writeString("nonce");
  writer.writeUInt32(type.nonce);
  writer.context().pop();
  writer.context().push("gasLimit", "BigInt", "writing property");
  writer.writeString("gasLimit");
  writer.writeBigInt(type.gasLimit);
  writer.context().pop();
  writer.context().push("gasPrice", "BigInt | null", "writing property");
  writer.writeString("gasPrice");
  writer.writeNullableBigInt(type.gasPrice);
  writer.context().pop();
  writer.context().push("data", "string", "writing property");
  writer.writeString("data");
  writer.writeString(type.data);
  writer.context().pop();
  writer.context().push("value", "BigInt", "writing property");
  writer.writeString("value");
  writer.writeBigInt(type.value);
  writer.context().pop();
  writer.context().push("chainId", "BigInt", "writing property");
  writer.writeString("chainId");
  writer.writeBigInt(type.chainId);
  writer.context().pop();
  writer.context().push("blockNumber", "BigInt | null", "writing property");
  writer.writeString("blockNumber");
  writer.writeNullableBigInt(type.blockNumber);
  writer.context().pop();
  writer.context().push("blockHash", "string | null", "writing property");
  writer.writeString("blockHash");
  writer.writeNullableString(type.blockHash);
  writer.context().pop();
  writer.context().push("timestamp", "Nullable<u32>", "writing property");
  writer.writeString("timestamp");
  writer.writeNullableUInt32(type.timestamp);
  writer.context().pop();
  writer.context().push("confirmations", "u32", "writing property");
  writer.writeString("confirmations");
  writer.writeUInt32(type.confirmations);
  writer.context().pop();
  writer.context().push("raw", "string | null", "writing property");
  writer.writeString("raw");
  writer.writeNullableString(type.raw);
  writer.context().pop();
  writer.context().push("r", "string | null", "writing property");
  writer.writeString("r");
  writer.writeNullableString(type.r);
  writer.context().pop();
  writer.context().push("s", "string | null", "writing property");
  writer.writeString("s");
  writer.writeNullableString(type.s);
  writer.context().pop();
  writer.context().push("v", "Nullable<u32>", "writing property");
  writer.writeString("v");
  writer.writeNullableUInt32(type.v);
  writer.context().pop();
  writer.context().push("type", "Nullable<u32>", "writing property");
  writer.writeString("type");
  writer.writeNullableUInt32(type.m_type);
  writer.context().pop();
  writer.context().push("accessList", "Array<Types.Ethereum_Access> | null", "writing property");
  writer.writeString("accessList");
  writer.writeNullableArray(type.accessList, (writer: Write, item: Types.Ethereum_Access): void => {
    Types.Ethereum_Access.write(writer, item);
  });
  writer.context().pop();
}

export function deserializeEthereum_TxResponse(buffer: ArrayBuffer): Ethereum_TxResponse {
  const context: Context = new Context("Deserializing imported object-type Ethereum_TxResponse");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_TxResponse(reader);
}

export function readEthereum_TxResponse(reader: Read): Ethereum_TxResponse {
  let numFields = reader.readMapLength();

  let _hash: string = "";
  let _hashSet: bool = false;
  let _to: string | null = null;
  let _from: string = "";
  let _fromSet: bool = false;
  let _nonce: u32 = 0;
  let _nonceSet: bool = false;
  let _gasLimit: BigInt = BigInt.fromUInt16(0);
  let _gasLimitSet: bool = false;
  let _gasPrice: BigInt | null = null;
  let _data: string = "";
  let _dataSet: bool = false;
  let _value: BigInt = BigInt.fromUInt16(0);
  let _valueSet: bool = false;
  let _chainId: BigInt = BigInt.fromUInt16(0);
  let _chainIdSet: bool = false;
  let _blockNumber: BigInt | null = null;
  let _blockHash: string | null = null;
  let _timestamp: Nullable<u32> = new Nullable<u32>();
  let _confirmations: u32 = 0;
  let _confirmationsSet: bool = false;
  let _raw: string | null = null;
  let _r: string | null = null;
  let _s: string | null = null;
  let _v: Nullable<u32> = new Nullable<u32>();
  let _type: Nullable<u32> = new Nullable<u32>();
  let _accessList: Array<Types.Ethereum_Access> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "hash") {
      reader.context().push(field, "string", "type found, reading property");
      _hash = reader.readString();
      _hashSet = true;
      reader.context().pop();
    }
    else if (field == "to") {
      reader.context().push(field, "string | null", "type found, reading property");
      _to = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "from") {
      reader.context().push(field, "string", "type found, reading property");
      _from = reader.readString();
      _fromSet = true;
      reader.context().pop();
    }
    else if (field == "nonce") {
      reader.context().push(field, "u32", "type found, reading property");
      _nonce = reader.readUInt32();
      _nonceSet = true;
      reader.context().pop();
    }
    else if (field == "gasLimit") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _gasLimit = reader.readBigInt();
      _gasLimitSet = true;
      reader.context().pop();
    }
    else if (field == "gasPrice") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _gasPrice = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "data") {
      reader.context().push(field, "string", "type found, reading property");
      _data = reader.readString();
      _dataSet = true;
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _value = reader.readBigInt();
      _valueSet = true;
      reader.context().pop();
    }
    else if (field == "chainId") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _chainId = reader.readBigInt();
      _chainIdSet = true;
      reader.context().pop();
    }
    else if (field == "blockNumber") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _blockNumber = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "blockHash") {
      reader.context().push(field, "string | null", "type found, reading property");
      _blockHash = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "timestamp") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _timestamp = reader.readNullableUInt32();
      reader.context().pop();
    }
    else if (field == "confirmations") {
      reader.context().push(field, "u32", "type found, reading property");
      _confirmations = reader.readUInt32();
      _confirmationsSet = true;
      reader.context().pop();
    }
    else if (field == "raw") {
      reader.context().push(field, "string | null", "type found, reading property");
      _raw = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "r") {
      reader.context().push(field, "string | null", "type found, reading property");
      _r = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "s") {
      reader.context().push(field, "string | null", "type found, reading property");
      _s = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "v") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _v = reader.readNullableUInt32();
      reader.context().pop();
    }
    else if (field == "type") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _type = reader.readNullableUInt32();
      reader.context().pop();
    }
    else if (field == "accessList") {
      reader.context().push(field, "Array<Types.Ethereum_Access> | null", "type found, reading property");
      _accessList = reader.readNullableArray((reader: Read): Types.Ethereum_Access => {
        const object = Types.Ethereum_Access.read(reader);
        return object;
      });
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_hashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'hash: String'"));
  }
  if (!_fromSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'from: String'"));
  }
  if (!_nonceSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'nonce: UInt32'"));
  }
  if (!_gasLimitSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'gasLimit: BigInt'"));
  }
  if (!_dataSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'data: String'"));
  }
  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'value: BigInt'"));
  }
  if (!_chainIdSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'chainId: BigInt'"));
  }
  if (!_confirmationsSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'confirmations: UInt32'"));
  }

  return {
    hash: _hash,
    to: _to,
    m_from: _from,
    nonce: _nonce,
    gasLimit: _gasLimit,
    gasPrice: _gasPrice,
    data: _data,
    value: _value,
    chainId: _chainId,
    blockNumber: _blockNumber,
    blockHash: _blockHash,
    timestamp: _timestamp,
    confirmations: _confirmations,
    raw: _raw,
    r: _r,
    s: _s,
    v: _v,
    m_type: _type,
    accessList: _accessList
  };
}
