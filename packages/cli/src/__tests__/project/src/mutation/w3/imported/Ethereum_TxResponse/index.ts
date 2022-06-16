import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeEthereum_TxResponse,
  deserializeEthereum_TxResponse,
  writeEthereum_TxResponse,
  readEthereum_TxResponse
} from "./serialization";
import * as Types from "../..";

export class Ethereum_TxResponse {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  hash: string;
  to: string | null;
  m_from: string;
  nonce: u32;
  gasLimit: BigInt;
  gasPrice: BigInt | null;
  data: string;
  value: BigInt;
  chainId: BigInt;
  blockNumber: BigInt | null;
  blockHash: string | null;
  timestamp: Nullable<u32>;
  confirmations: u32;
  raw: string | null;
  r: string | null;
  s: string | null;
  v: Nullable<u32>;
  m_type: Nullable<u32>;
  accessList: Array<Types.Ethereum_Access> | null;

  static toBuffer(type: Ethereum_TxResponse): ArrayBuffer {
    return serializeEthereum_TxResponse(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_TxResponse {
    return deserializeEthereum_TxResponse(buffer);
  }

  static write(writer: Write, type: Ethereum_TxResponse): void {
    writeEthereum_TxResponse(writer, type);
  }

  static read(reader: Read): Ethereum_TxResponse {
    return readEthereum_TxResponse(reader);
  }
}
