import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeNear_SignTransactionResult,
  deserializeNear_SignTransactionResult,
  writeNear_SignTransactionResult,
  readNear_SignTransactionResult
} from "./serialization";
import * as Types from "../..";

export class Near_SignTransactionResult {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  hash: ArrayBuffer;
  signedTx: Types.Near_SignedTransaction;

  static toBuffer(type: Near_SignTransactionResult): ArrayBuffer {
    return serializeNear_SignTransactionResult(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Near_SignTransactionResult {
    return deserializeNear_SignTransactionResult(buffer);
  }

  static write(writer: Write, type: Near_SignTransactionResult): void {
    writeNear_SignTransactionResult(writer, type);
  }

  static read(reader: Read): Near_SignTransactionResult {
    return readNear_SignTransactionResult(reader);
  }
}
