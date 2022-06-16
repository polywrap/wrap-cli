import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeNear_AccountView,
  deserializeNear_AccountView,
  writeNear_AccountView,
  readNear_AccountView
} from "./serialization";
import * as Types from "../..";

export class Near_AccountView {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  amount: string;
  locked: string;
  codeHash: string;
  storageUsage: BigInt;
  storagePaidAt: BigInt;
  blockHeight: BigInt;
  blockHash: string;

  static toBuffer(type: Near_AccountView): ArrayBuffer {
    return serializeNear_AccountView(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Near_AccountView {
    return deserializeNear_AccountView(buffer);
  }

  static write(writer: Write, type: Near_AccountView): void {
    writeNear_AccountView(writer, type);
  }

  static read(reader: Read): Near_AccountView {
    return readNear_AccountView(reader);
  }
}
