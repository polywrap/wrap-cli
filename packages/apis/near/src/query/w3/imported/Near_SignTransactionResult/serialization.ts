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
import { Near_SignTransactionResult } from "./";
import * as Types from "../..";

export function serializeNear_SignTransactionResult(type: Near_SignTransactionResult): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Near_SignTransactionResult");
  const sizer = new WriteSizer(sizerContext);
  writeNear_SignTransactionResult(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Near_SignTransactionResult");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeNear_SignTransactionResult(encoder, type);
  return buffer;
}

export function writeNear_SignTransactionResult(writer: Write, type: Near_SignTransactionResult): void {
  writer.writeMapLength(2);
  writer.context().push("hash", "ArrayBuffer", "writing property");
  writer.writeString("hash");
  writer.writeBytes(type.hash);
  writer.context().pop();
  writer.context().push("signedTx", "Types.Near_SignedTransaction", "writing property");
  writer.writeString("signedTx");
  Types.Near_SignedTransaction.write(writer, type.signedTx);
  writer.context().pop();
}

export function deserializeNear_SignTransactionResult(buffer: ArrayBuffer): Near_SignTransactionResult {
  const context: Context = new Context("Deserializing imported object-type Near_SignTransactionResult");
  const reader = new ReadDecoder(buffer, context);
  return readNear_SignTransactionResult(reader);
}

export function readNear_SignTransactionResult(reader: Read): Near_SignTransactionResult {
  let numFields = reader.readMapLength();

  let _hash: ArrayBuffer = new ArrayBuffer(0);
  let _hashSet: bool = false;
  let _signedTx: Types.Near_SignedTransaction | null = null;
  let _signedTxSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "hash") {
      reader.context().push(field, "ArrayBuffer", "type found, reading property");
      _hash = reader.readBytes();
      _hashSet = true;
      reader.context().pop();
    }
    else if (field == "signedTx") {
      reader.context().push(field, "Types.Near_SignedTransaction", "type found, reading property");
      const object = Types.Near_SignedTransaction.read(reader);
      _signedTx = object;
      _signedTxSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_hashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'hash: Bytes'"));
  }
  if (!_signedTx || !_signedTxSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'signedTx: Near_SignedTransaction'"));
  }

  return {
    hash: _hash,
    signedTx: _signedTx
  };
}
