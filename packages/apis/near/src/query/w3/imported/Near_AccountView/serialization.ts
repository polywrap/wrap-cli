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
import { Near_AccountView } from "./";
import * as Types from "../..";

export function serializeNear_AccountView(type: Near_AccountView): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Near_AccountView");
  const sizer = new WriteSizer(sizerContext);
  writeNear_AccountView(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Near_AccountView");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeNear_AccountView(encoder, type);
  return buffer;
}

export function writeNear_AccountView(writer: Write, type: Near_AccountView): void {
  writer.writeMapLength(7);
  writer.context().push("amount", "string", "writing property");
  writer.writeString("amount");
  writer.writeString(type.amount);
  writer.context().pop();
  writer.context().push("locked", "string", "writing property");
  writer.writeString("locked");
  writer.writeString(type.locked);
  writer.context().pop();
  writer.context().push("codeHash", "string", "writing property");
  writer.writeString("codeHash");
  writer.writeString(type.codeHash);
  writer.context().pop();
  writer.context().push("storageUsage", "BigInt", "writing property");
  writer.writeString("storageUsage");
  writer.writeBigInt(type.storageUsage);
  writer.context().pop();
  writer.context().push("storagePaidAt", "BigInt", "writing property");
  writer.writeString("storagePaidAt");
  writer.writeBigInt(type.storagePaidAt);
  writer.context().pop();
  writer.context().push("blockHeight", "BigInt", "writing property");
  writer.writeString("blockHeight");
  writer.writeBigInt(type.blockHeight);
  writer.context().pop();
  writer.context().push("blockHash", "string", "writing property");
  writer.writeString("blockHash");
  writer.writeString(type.blockHash);
  writer.context().pop();
}

export function deserializeNear_AccountView(buffer: ArrayBuffer): Near_AccountView {
  const context: Context = new Context("Deserializing imported object-type Near_AccountView");
  const reader = new ReadDecoder(buffer, context);
  return readNear_AccountView(reader);
}

export function readNear_AccountView(reader: Read): Near_AccountView {
  let numFields = reader.readMapLength();

  let _amount: string = "";
  let _amountSet: bool = false;
  let _locked: string = "";
  let _lockedSet: bool = false;
  let _codeHash: string = "";
  let _codeHashSet: bool = false;
  let _storageUsage: BigInt = BigInt.fromUInt16(0);
  let _storageUsageSet: bool = false;
  let _storagePaidAt: BigInt = BigInt.fromUInt16(0);
  let _storagePaidAtSet: bool = false;
  let _blockHeight: BigInt = BigInt.fromUInt16(0);
  let _blockHeightSet: bool = false;
  let _blockHash: string = "";
  let _blockHashSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "amount") {
      reader.context().push(field, "string", "type found, reading property");
      _amount = reader.readString();
      _amountSet = true;
      reader.context().pop();
    }
    else if (field == "locked") {
      reader.context().push(field, "string", "type found, reading property");
      _locked = reader.readString();
      _lockedSet = true;
      reader.context().pop();
    }
    else if (field == "codeHash") {
      reader.context().push(field, "string", "type found, reading property");
      _codeHash = reader.readString();
      _codeHashSet = true;
      reader.context().pop();
    }
    else if (field == "storageUsage") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _storageUsage = reader.readBigInt();
      _storageUsageSet = true;
      reader.context().pop();
    }
    else if (field == "storagePaidAt") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _storagePaidAt = reader.readBigInt();
      _storagePaidAtSet = true;
      reader.context().pop();
    }
    else if (field == "blockHeight") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _blockHeight = reader.readBigInt();
      _blockHeightSet = true;
      reader.context().pop();
    }
    else if (field == "blockHash") {
      reader.context().push(field, "string", "type found, reading property");
      _blockHash = reader.readString();
      _blockHashSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_amountSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'amount: String'"));
  }
  if (!_lockedSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'locked: String'"));
  }
  if (!_codeHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'codeHash: String'"));
  }
  if (!_storageUsageSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'storageUsage: BigInt'"));
  }
  if (!_storagePaidAtSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'storagePaidAt: BigInt'"));
  }
  if (!_blockHeightSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockHeight: BigInt'"));
  }
  if (!_blockHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockHash: String'"));
  }

  return {
    amount: _amount,
    locked: _locked,
    codeHash: _codeHash,
    storageUsage: _storageUsage,
    storagePaidAt: _storagePaidAt,
    blockHeight: _blockHeight,
    blockHash: _blockHash
  };
}
