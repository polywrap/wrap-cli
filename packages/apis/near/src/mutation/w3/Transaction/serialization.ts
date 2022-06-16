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
import { Transaction } from "./";
import * as Types from "..";

export function serializeTransaction(type: Transaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: Transaction");
  const sizer = new WriteSizer(sizerContext);
  writeTransaction(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: Transaction");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeTransaction(encoder, type);
  return buffer;
}

export function writeTransaction(writer: Write, type: Transaction): void {
  writer.writeMapLength(6);
  writer.context().push("signerId", "string", "writing property");
  writer.writeString("signerId");
  writer.writeString(type.signerId);
  writer.context().pop();
  writer.context().push("publicKey", "Types.PublicKey", "writing property");
  writer.writeString("publicKey");
  Types.PublicKey.write(writer, type.publicKey);
  writer.context().pop();
  writer.context().push("nonce", "BigInt | null", "writing property");
  writer.writeString("nonce");
  writer.writeNullableBigInt(type.nonce);
  writer.context().pop();
  writer.context().push("receiverId", "string", "writing property");
  writer.writeString("receiverId");
  writer.writeString(type.receiverId);
  writer.context().pop();
  writer.context().push("blockHash", "ArrayBuffer", "writing property");
  writer.writeString("blockHash");
  writer.writeBytes(type.blockHash);
  writer.context().pop();
  writer.context().push("actions", "Array<Types.Action>", "writing property");
  writer.writeString("actions");
  writer.writeArray(type.actions, (writer: Write, item: Types.Action): void => {
    Types.Action.write(writer, item);
  });
  writer.context().pop();
}

export function deserializeTransaction(buffer: ArrayBuffer): Transaction {
  const context: Context = new Context("Deserializing object-type Transaction");
  const reader = new ReadDecoder(buffer, context);
  return readTransaction(reader);
}

export function readTransaction(reader: Read): Transaction {
  let numFields = reader.readMapLength();

  let _signerId: string = "";
  let _signerIdSet: bool = false;
  let _publicKey: Types.PublicKey | null = null;
  let _publicKeySet: bool = false;
  let _nonce: BigInt | null = null;
  let _receiverId: string = "";
  let _receiverIdSet: bool = false;
  let _blockHash: ArrayBuffer = new ArrayBuffer(0);
  let _blockHashSet: bool = false;
  let _actions: Array<Types.Action> = [];
  let _actionsSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "signerId") {
      reader.context().push(field, "string", "type found, reading property");
      _signerId = reader.readString();
      _signerIdSet = true;
      reader.context().pop();
    }
    else if (field == "publicKey") {
      reader.context().push(field, "Types.PublicKey", "type found, reading property");
      const object = Types.PublicKey.read(reader);
      _publicKey = object;
      _publicKeySet = true;
      reader.context().pop();
    }
    else if (field == "nonce") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _nonce = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "receiverId") {
      reader.context().push(field, "string", "type found, reading property");
      _receiverId = reader.readString();
      _receiverIdSet = true;
      reader.context().pop();
    }
    else if (field == "blockHash") {
      reader.context().push(field, "ArrayBuffer", "type found, reading property");
      _blockHash = reader.readBytes();
      _blockHashSet = true;
      reader.context().pop();
    }
    else if (field == "actions") {
      reader.context().push(field, "Array<Types.Action>", "type found, reading property");
      _actions = reader.readArray((reader: Read): Types.Action => {
        const object = Types.Action.read(reader);
        return object;
      });
      _actionsSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_signerIdSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'signerId: String'"));
  }
  if (!_publicKey || !_publicKeySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'publicKey: PublicKey'"));
  }
  if (!_receiverIdSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'receiverId: String'"));
  }
  if (!_blockHashSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'blockHash: Bytes'"));
  }
  if (!_actionsSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'actions: [Action]'"));
  }

  return {
    signerId: _signerId,
    publicKey: _publicKey,
    nonce: _nonce,
    receiverId: _receiverId,
    blockHash: _blockHash,
    actions: _actions
  };
}
