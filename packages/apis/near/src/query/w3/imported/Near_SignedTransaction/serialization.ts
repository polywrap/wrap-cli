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
import { Near_SignedTransaction } from "./";
import * as Types from "../..";

export function serializeNear_SignedTransaction(type: Near_SignedTransaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Near_SignedTransaction");
  const sizer = new WriteSizer(sizerContext);
  writeNear_SignedTransaction(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Near_SignedTransaction");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeNear_SignedTransaction(encoder, type);
  return buffer;
}

export function writeNear_SignedTransaction(writer: Write, type: Near_SignedTransaction): void {
  writer.writeMapLength(2);
  writer.context().push("transaction", "Types.Near_Transaction", "writing property");
  writer.writeString("transaction");
  Types.Near_Transaction.write(writer, type.transaction);
  writer.context().pop();
  writer.context().push("signature", "Types.Near_Signature", "writing property");
  writer.writeString("signature");
  Types.Near_Signature.write(writer, type.signature);
  writer.context().pop();
}

export function deserializeNear_SignedTransaction(buffer: ArrayBuffer): Near_SignedTransaction {
  const context: Context = new Context("Deserializing imported object-type Near_SignedTransaction");
  const reader = new ReadDecoder(buffer, context);
  return readNear_SignedTransaction(reader);
}

export function readNear_SignedTransaction(reader: Read): Near_SignedTransaction {
  let numFields = reader.readMapLength();

  let _transaction: Types.Near_Transaction | null = null;
  let _transactionSet: bool = false;
  let _signature: Types.Near_Signature | null = null;
  let _signatureSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "transaction") {
      reader.context().push(field, "Types.Near_Transaction", "type found, reading property");
      const object = Types.Near_Transaction.read(reader);
      _transaction = object;
      _transactionSet = true;
      reader.context().pop();
    }
    else if (field == "signature") {
      reader.context().push(field, "Types.Near_Signature", "type found, reading property");
      const object = Types.Near_Signature.read(reader);
      _signature = object;
      _signatureSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_transaction || !_transactionSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'transaction: Near_Transaction'"));
  }
  if (!_signature || !_signatureSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'signature: Near_Signature'"));
  }

  return {
    transaction: _transaction,
    signature: _signature
  };
}
