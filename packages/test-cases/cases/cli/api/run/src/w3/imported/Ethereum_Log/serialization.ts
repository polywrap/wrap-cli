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
import { Ethereum_Log } from "./";
import * as Types from "../..";

export function serializeEthereum_Log(type: Ethereum_Log): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_Log");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_Log(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_Log");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_Log(encoder, type);
  return buffer;
}

export function writeEthereum_Log(writer: Write, type: Ethereum_Log): void {
  writer.writeMapLength(9);
  writer.context().push("blockNumber", "BigInt", "writing property");
  writer.writeString("blockNumber");
  writer.writeBigInt(type.blockNumber);
  writer.context().pop();
  writer.context().push("blockHash", "string", "writing property");
  writer.writeString("blockHash");
  writer.writeString(type.blockHash);
  writer.context().pop();
  writer.context().push("transactionIndex", "u32", "writing property");
  writer.writeString("transactionIndex");
  writer.writeUInt32(type.transactionIndex);
  writer.context().pop();
  writer.context().push("removed", "bool", "writing property");
  writer.writeString("removed");
  writer.writeBool(type.removed);
  writer.context().pop();
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(type.address);
  writer.context().pop();
  writer.context().push("data", "string", "writing property");
  writer.writeString("data");
  writer.writeString(type.data);
  writer.context().pop();
  writer.context().push("topics", "Array<string>", "writing property");
  writer.writeString("topics");
  writer.writeArray(type.topics, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("transactionHash", "string", "writing property");
  writer.writeString("transactionHash");
  writer.writeString(type.transactionHash);
  writer.context().pop();
  writer.context().push("logIndex", "u32", "writing property");
  writer.writeString("logIndex");
  writer.writeUInt32(type.logIndex);
  writer.context().pop();
}

export function deserializeEthereum_Log(buffer: ArrayBuffer): Ethereum_Log {
  const context: Context = new Context("Deserializing imported object-type Ethereum_Log");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_Log(reader);
}

export function readEthereum_Log(reader: Read): Ethereum_Log {
  let numFields = reader.readMapLength();

  let _blockNumber: BigInt = BigInt.fromUInt16(0);
  let _blockNumberSet: bool = false;
  let _blockHash: string = "";
  let _blockHashSet: bool = false;
  let _transactionIndex: u32 = 0;
  let _transactionIndexSet: bool = false;
  let _removed: bool = false;
  let _removedSet: bool = false;
  let _address: string = "";
  let _addressSet: bool = false;
  let _data: string = "";
  let _dataSet: bool = false;
  let _topics: Array<string> = [];
  let _topicsSet: bool = false;
  let _transactionHash: string = "";
  let _transactionHashSet: bool = false;
  let _logIndex: u32 = 0;
  let _logIndexSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "blockNumber") {
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
    else if (field == "transactionIndex") {
      reader.context().push(field, "u32", "type found, reading property");
      _transactionIndex = reader.readUInt32();
      _transactionIndexSet = true;
      reader.context().pop();
    }
    else if (field == "removed") {
      reader.context().push(field, "bool", "type found, reading property");
      _removed = reader.readBool();
      _removedSet = true;
      reader.context().pop();
    }
    else if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "data") {
      reader.context().push(field, "string", "type found, reading property");
      _data = reader.readString();
      _dataSet = true;
      reader.context().pop();
    }
    else if (field == "topics") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _topics = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _topicsSet = true;
      reader.context().pop();
    }
    else if (field == "transactionHash") {
      reader.context().push(field, "string", "type found, reading property");
      _transactionHash = reader.readString();
      _transactionHashSet = true;
      reader.context().pop();
    }
    else if (field == "logIndex") {
      reader.context().push(field, "u32", "type found, reading property");
      _logIndex = reader.readUInt32();
      _logIndexSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_blockNumberSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockNumber: BigInt'"));
  }
  if (!_blockHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockHash: String'"));
  }
  if (!_transactionIndexSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'transactionIndex: UInt32'"));
  }
  if (!_removedSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'removed: Boolean'"));
  }
  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'address: String'"));
  }
  if (!_dataSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'data: String'"));
  }
  if (!_topicsSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'topics: [String]'"));
  }
  if (!_transactionHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'transactionHash: String'"));
  }
  if (!_logIndexSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'logIndex: UInt32'"));
  }

  return {
    blockNumber: _blockNumber,
    blockHash: _blockHash,
    transactionIndex: _transactionIndex,
    removed: _removed,
    address: _address,
    data: _data,
    topics: _topics,
    transactionHash: _transactionHash,
    logIndex: _logIndex
  };
}
