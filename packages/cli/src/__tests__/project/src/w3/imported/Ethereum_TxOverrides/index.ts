import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeEthereum_TxOverrides,
  deserializeEthereum_TxOverrides,
  writeEthereum_TxOverrides,
  readEthereum_TxOverrides
} from "./serialization";
import * as Types from "../..";

export class Ethereum_TxOverrides {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  gasLimit: BigInt | null;
  gasPrice: BigInt | null;
  value: BigInt | null;

  static toBuffer(type: Ethereum_TxOverrides): ArrayBuffer {
    return serializeEthereum_TxOverrides(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_TxOverrides {
    return deserializeEthereum_TxOverrides(buffer);
  }

  static write(writer: Write, type: Ethereum_TxOverrides): void {
    writeEthereum_TxOverrides(writer, type);
  }

  static read(reader: Read): Ethereum_TxOverrides {
    return readEthereum_TxOverrides(reader);
  }
}
