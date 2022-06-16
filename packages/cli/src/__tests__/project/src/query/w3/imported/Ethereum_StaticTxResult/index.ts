import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeEthereum_StaticTxResult,
  deserializeEthereum_StaticTxResult,
  writeEthereum_StaticTxResult,
  readEthereum_StaticTxResult
} from "./serialization";
import * as Types from "../..";

export class Ethereum_StaticTxResult {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  result: string;
  error: bool;

  static toBuffer(type: Ethereum_StaticTxResult): ArrayBuffer {
    return serializeEthereum_StaticTxResult(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_StaticTxResult {
    return deserializeEthereum_StaticTxResult(buffer);
  }

  static write(writer: Write, type: Ethereum_StaticTxResult): void {
    writeEthereum_StaticTxResult(writer, type);
  }

  static read(reader: Read): Ethereum_StaticTxResult {
    return readEthereum_StaticTxResult(reader);
  }
}
