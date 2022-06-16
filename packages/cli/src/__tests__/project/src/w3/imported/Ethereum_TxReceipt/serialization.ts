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
import { Ethereum_TxReceipt } from "./";
import * as Types from "../..";

export function serializeEthereum_TxReceipt(type: Ethereum_TxReceipt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_TxReceipt");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_TxReceipt(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_TxReceipt");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_TxReceipt(encoder, type);
  return buffer;
}

export function writeEthereum_TxReceipt(writer: Write, type: Ethereum_TxReceipt): void {
  writer.writeMapLength(17);
  writer.context().push("to", "string", "writing property");
  writer.writeString("to");
  writer.writeString(type.to);
  writer.context().pop();
  writer.context().push("from", "string", "writing property");
  writer.writeString("from");
  writer.writeString(type.m_from);
  writer.context().pop();
  writer.context().push("contractAddress", "string", "writing property");
  writer.writeString("contractAddress");
  writer.writeString(type.contractAddress);
  writer.context().pop();
  writer.context().push("transactionIndex", "u32", "writing property");
  writer.writeString("transactionIndex");
  writer.writeUInt32(type.transactionIndex);
  writer.context().pop();
  writer.context().push("root", "string | null", "writing property");
  writer.writeString("root");
  writer.writeNullableString(type.root);
  writer.context().pop();
  writer.context().push("gasUsed", "BigInt", "writing property");
  writer.writeString("gasUsed");
  writer.writeBigInt(type.gasUsed);
  writer.context().pop();
  writer.context().push("logsBloom", "string", "writing property");
  writer.writeString("logsBloom");
  writer.writeString(type.logsBloom);
  writer.context().pop();
  writer.context().push("transactionHash", "string", "writing property");
  writer.writeString("transactionHash");
  writer.writeString(type.transactionHash);
  writer.context().pop();
  writer.context().push("logs", "Array<Types.Ethereum_Log>", "writing property");
  writer.writeString("logs");
  writer.writeArray(type.logs, (writer: Write, item: Types.Ethereum_Log): void => {
    Types.Ethereum_Log.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("blockNumber", "BigInt", "writing property");
  writer.writeString("blockNumber");
  writer.writeBigInt(type.blockNumber);
  writer.context().pop();
  writer.context().push("blockHash", "string", "writing property");
  writer.writeString("blockHash");
  writer.writeString(type.blockHash);
  writer.context().pop();
  writer.context().push("confirmations", "u32", "writing property");
  writer.writeString("confirmations");
  writer.writeUInt32(type.confirmations);
  writer.context().pop();
  writer.context().push("cumulativeGasUsed", "BigInt", "writing property");
  writer.writeString("cumulativeGasUsed");
  writer.writeBigInt(type.cumulativeGasUsed);
  writer.context().pop();
  writer.context().push("effectiveGasPrice", "BigInt", "writing property");
  writer.writeString("effectiveGasPrice");
  writer.writeBigInt(type.effectiveGasPrice);
  writer.context().pop();
  writer.context().push("byzantium", "bool", "writing property");
  writer.writeString("byzantium");
  writer.writeBool(type.byzantium);
  writer.context().pop();
  writer.context().push("type", "u32", "writing property");
  writer.writeString("type");
  writer.writeUInt32(type.m_type);
  writer.context().pop();
  writer.context().push("status", "Nullable<u32>", "writing property");
  writer.writeString("status");
  writer.writeNullableUInt32(type.status);
  writer.context().pop();
}

export function deserializeEthereum_TxReceipt(buffer: ArrayBuffer): Ethereum_TxReceipt {
  const context: Context = new Context("Deserializing imported object-type Ethereum_TxReceipt");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_TxReceipt(reader);
}

export function readEthereum_TxReceipt(reader: Read): Ethereum_TxReceipt {
  let numFields = reader.readMapLength();

  let _to: string = "";
  let _toSet: bool = false;
  let _from: string = "";
  let _fromSet: bool = false;
  let _contractAddress: string = "";
  let _contractAddressSet: bool = false;
  let _transactionIndex: u32 = 0;
  let _transactionIndexSet: bool = false;
  let _root: string | null = null;
  let _gasUsed: BigInt = BigInt.fromUInt16(0);
  let _gasUsedSet: bool = false;
  let _logsBloom: string = "";
  let _logsBloomSet: bool = false;
  let _transactionHash: string = "";
  let _transactionHashSet: bool = false;
  let _logs: Array<Types.Ethereum_Log> = [];
  let _logsSet: bool = false;
  let _blockNumber: BigInt = BigInt.fromUInt16(0);
  let _blockNumberSet: bool = false;
  let _blockHash: string = "";
  let _blockHashSet: bool = false;
  let _confirmations: u32 = 0;
  let _confirmationsSet: bool = false;
  let _cumulativeGasUsed: BigInt = BigInt.fromUInt16(0);
  let _cumulativeGasUsedSet: bool = false;
  let _effectiveGasPrice: BigInt = BigInt.fromUInt16(0);
  let _effectiveGasPriceSet: bool = false;
  let _byzantium: bool = false;
  let _byzantiumSet: bool = false;
  let _type: u32 = 0;
  let _typeSet: bool = false;
  let _status: Nullable<u32> = new Nullable<u32>();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "to") {
      reader.context().push(field, "string", "type found, reading property");
      _to = reader.readString();
      _toSet = true;
      reader.context().pop();
    }
    else if (field == "from") {
      reader.context().push(field, "string", "type found, reading property");
      _from = reader.readString();
      _fromSet = true;
      reader.context().pop();
    }
    else if (field == "contractAddress") {
      reader.context().push(field, "string", "type found, reading property");
      _contractAddress = reader.readString();
      _contractAddressSet = true;
      reader.context().pop();
    }
    else if (field == "transactionIndex") {
      reader.context().push(field, "u32", "type found, reading property");
      _transactionIndex = reader.readUInt32();
      _transactionIndexSet = true;
      reader.context().pop();
    }
    else if (field == "root") {
      reader.context().push(field, "string | null", "type found, reading property");
      _root = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "gasUsed") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _gasUsed = reader.readBigInt();
      _gasUsedSet = true;
      reader.context().pop();
    }
    else if (field == "logsBloom") {
      reader.context().push(field, "string", "type found, reading property");
      _logsBloom = reader.readString();
      _logsBloomSet = true;
      reader.context().pop();
    }
    else if (field == "transactionHash") {
      reader.context().push(field, "string", "type found, reading property");
      _transactionHash = reader.readString();
      _transactionHashSet = true;
      reader.context().pop();
    }
    else if (field == "logs") {
      reader.context().push(field, "Array<Types.Ethereum_Log>", "type found, reading property");
      _logs = reader.readArray((reader: Read): Types.Ethereum_Log => {
        const object = Types.Ethereum_Log.read(reader);
        return object;
      });
      _logsSet = true;
      reader.context().pop();
    }
    else if (field == "blockNumber") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _blockNumber = reader.readBigInt();
      _blockNumberSet = true;
      reader.context().pop();
    }
    else if (field == "blockHash") {
      reader.context().push(field, "string", "type found, reading property");
      _blockHash = reader.readString();
      _blockHashSet = true;
      reader.context().pop();
    }
    else if (field == "confirmations") {
      reader.context().push(field, "u32", "type found, reading property");
      _confirmations = reader.readUInt32();
      _confirmationsSet = true;
      reader.context().pop();
    }
    else if (field == "cumulativeGasUsed") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _cumulativeGasUsed = reader.readBigInt();
      _cumulativeGasUsedSet = true;
      reader.context().pop();
    }
    else if (field == "effectiveGasPrice") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _effectiveGasPrice = reader.readBigInt();
      _effectiveGasPriceSet = true;
      reader.context().pop();
    }
    else if (field == "byzantium") {
      reader.context().push(field, "bool", "type found, reading property");
      _byzantium = reader.readBool();
      _byzantiumSet = true;
      reader.context().pop();
    }
    else if (field == "type") {
      reader.context().push(field, "u32", "type found, reading property");
      _type = reader.readUInt32();
      _typeSet = true;
      reader.context().pop();
    }
    else if (field == "status") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _status = reader.readNullableUInt32();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_toSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'to: String'"));
  }
  if (!_fromSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'from: String'"));
  }
  if (!_contractAddressSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'contractAddress: String'"));
  }
  if (!_transactionIndexSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'transactionIndex: UInt32'"));
  }
  if (!_gasUsedSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'gasUsed: BigInt'"));
  }
  if (!_logsBloomSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'logsBloom: String'"));
  }
  if (!_transactionHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'transactionHash: String'"));
  }
  if (!_logsSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'logs: [Ethereum_Log]'"));
  }
  if (!_blockNumberSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockNumber: BigInt'"));
  }
  if (!_blockHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockHash: String'"));
  }
  if (!_confirmationsSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'confirmations: UInt32'"));
  }
  if (!_cumulativeGasUsedSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'cumulativeGasUsed: BigInt'"));
  }
  if (!_effectiveGasPriceSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'effectiveGasPrice: BigInt'"));
  }
  if (!_byzantiumSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'byzantium: Boolean'"));
  }
  if (!_typeSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'type: UInt32'"));
  }

  return {
    to: _to,
    m_from: _from,
    contractAddress: _contractAddress,
    transactionIndex: _transactionIndex,
    root: _root,
    gasUsed: _gasUsed,
    logsBloom: _logsBloom,
    transactionHash: _transactionHash,
    logs: _logs,
    blockNumber: _blockNumber,
    blockHash: _blockHash,
    confirmations: _confirmations,
    cumulativeGasUsed: _cumulativeGasUsed,
    effectiveGasPrice: _effectiveGasPrice,
    byzantium: _byzantium,
    m_type: _type,
    status: _status
  };
}
