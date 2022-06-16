import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeNear_SignedTransaction,
  deserializeNear_SignedTransaction,
  writeNear_SignedTransaction,
  readNear_SignedTransaction
} from "./serialization";
import * as Types from "../..";

export class Near_SignedTransaction {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  transaction: Types.Near_Transaction;
  signature: Types.Near_Signature;

  static toBuffer(type: Near_SignedTransaction): ArrayBuffer {
    return serializeNear_SignedTransaction(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Near_SignedTransaction {
    return deserializeNear_SignedTransaction(buffer);
  }

  static write(writer: Write, type: Near_SignedTransaction): void {
    writeNear_SignedTransaction(writer, type);
  }

  static read(reader: Read): Near_SignedTransaction {
    return readNear_SignedTransaction(reader);
  }
}
