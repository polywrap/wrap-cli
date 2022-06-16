import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeTransaction,
  deserializeTransaction,
  writeTransaction,
  readTransaction
} from "./serialization";
import * as Types from "..";

export class Transaction {
  signerId: string;
  publicKey: Types.PublicKey;
  nonce: BigInt | null;
  receiverId: string;
  blockHash: ArrayBuffer;
  actions: Array<Types.Action>;

  static toBuffer(type: Transaction): ArrayBuffer {
    return serializeTransaction(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Transaction {
    return deserializeTransaction(buffer);
  }

  static write(writer: Write, type: Transaction): void {
    writeTransaction(writer, type);
  }

  static read(reader: Read): Transaction {
    return readTransaction(reader);
  }
}
