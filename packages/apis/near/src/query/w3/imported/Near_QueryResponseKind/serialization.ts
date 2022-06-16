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
import { Near_QueryResponseKind } from "./";
import * as Types from "../..";

export function serializeNear_QueryResponseKind(type: Near_QueryResponseKind): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Near_QueryResponseKind");
  const sizer = new WriteSizer(sizerContext);
  writeNear_QueryResponseKind(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Near_QueryResponseKind");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeNear_QueryResponseKind(encoder, type);
  return buffer;
}

export function writeNear_QueryResponseKind(writer: Write, type: Near_QueryResponseKind): void {
  writer.writeMapLength(2);
  writer.context().push("blockHeight", "BigInt", "writing property");
  writer.writeString("blockHeight");
  writer.writeBigInt(type.blockHeight);
  writer.context().pop();
  writer.context().push("blockHash", "string", "writing property");
  writer.writeString("blockHash");
  writer.writeString(type.blockHash);
  writer.context().pop();
}

export function deserializeNear_QueryResponseKind(buffer: ArrayBuffer): Near_QueryResponseKind {
  const context: Context = new Context("Deserializing imported object-type Near_QueryResponseKind");
  const reader = new ReadDecoder(buffer, context);
  return readNear_QueryResponseKind(reader);
}

export function readNear_QueryResponseKind(reader: Read): Near_QueryResponseKind {
  let numFields = reader.readMapLength();

  let _blockHeight: BigInt = BigInt.fromUInt16(0);
  let _blockHeightSet: bool = false;
  let _blockHash: string = "";
  let _blockHashSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "blockHeight") {
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

  if (!_blockHeightSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockHeight: BigInt'"));
  }
  if (!_blockHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockHash: String'"));
  }

  return {
    blockHeight: _blockHeight,
    blockHash: _blockHash
  };
}
