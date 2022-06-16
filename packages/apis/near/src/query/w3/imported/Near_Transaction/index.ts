import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeNear_Transaction,
  deserializeNear_Transaction,
  writeNear_Transaction,
  readNear_Transaction
} from "./serialization";
import * as Types from "../..";

export class Near_Transaction {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  signerId: string;
  publicKey: Types.Near_PublicKey;
  nonce: BigInt | null;
  receiverId: string;
  blockHash: ArrayBuffer;
  actions: Array<Types.Near_Action>;

  static toBuffer(type: Near_Transaction): ArrayBuffer {
    return serializeNear_Transaction(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Near_Transaction {
    return deserializeNear_Transaction(buffer);
  }

  static write(writer: Write, type: Near_Transaction): void {
    writeNear_Transaction(writer, type);
  }

  static read(reader: Read): Near_Transaction {
    return readNear_Transaction(reader);
  }
}
