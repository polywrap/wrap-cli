import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeEthereum_TxRequest,
  deserializeEthereum_TxRequest,
  writeEthereum_TxRequest,
  readEthereum_TxRequest
} from "./serialization";
import * as Types from "../..";

export class Ethereum_TxRequest {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  to: string | null;
  m_from: string | null;
  nonce: Nullable<u32>;
  gasLimit: BigInt | null;
  gasPrice: BigInt | null;
  data: string | null;
  value: BigInt | null;
  chainId: BigInt | null;
  m_type: Nullable<u32>;

  static toBuffer(type: Ethereum_TxRequest): ArrayBuffer {
    return serializeEthereum_TxRequest(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_TxRequest {
    return deserializeEthereum_TxRequest(buffer);
  }

  static write(writer: Write, type: Ethereum_TxRequest): void {
    writeEthereum_TxRequest(writer, type);
  }

  static read(reader: Read): Ethereum_TxRequest {
    return readEthereum_TxRequest(reader);
  }
}
