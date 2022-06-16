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
import { QueryResponseKind } from "./";
import * as Types from "..";

export function serializeQueryResponseKind(type: QueryResponseKind): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: QueryResponseKind");
  const sizer = new WriteSizer(sizerContext);
  writeQueryResponseKind(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: QueryResponseKind");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeQueryResponseKind(encoder, type);
  return buffer;
}

export function writeQueryResponseKind(writer: Write, type: QueryResponseKind): void {
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

export function deserializeQueryResponseKind(buffer: ArrayBuffer): QueryResponseKind {
  const context: Context = new Context("Deserializing object-type QueryResponseKind");
  const reader = new ReadDecoder(buffer, context);
  return readQueryResponseKind(reader);
}

export function readQueryResponseKind(reader: Read): QueryResponseKind {
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
