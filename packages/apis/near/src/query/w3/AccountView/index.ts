import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeAccountView,
  deserializeAccountView,
  writeAccountView,
  readAccountView
} from "./serialization";
import * as Types from "..";

export class AccountView {
  amount: string;
  locked: string;
  codeHash: string;
  storageUsage: BigInt;
  storagePaidAt: BigInt;
  blockHeight: BigInt;
  blockHash: string;

  static toBuffer(type: AccountView): ArrayBuffer {
    return serializeAccountView(type);
  }

  static fromBuffer(buffer: ArrayBuffer): AccountView {
    return deserializeAccountView(buffer);
  }

  static write(writer: Write, type: AccountView): void {
    writeAccountView(writer, type);
  }

  static read(reader: Read): AccountView {
    return readAccountView(reader);
  }
}
