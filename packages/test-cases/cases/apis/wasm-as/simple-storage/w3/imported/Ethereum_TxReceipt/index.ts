import {
  Read,
  Write,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  JSONSerializer,
  JSONDeserializer,
} from "@web3api/wasm-as";
import {
  serializeEthereum_TxReceipt,
  deserializeEthereum_TxReceipt,
  writeEthereum_TxReceipt,
  readEthereum_TxReceipt
} from "./serialization";
import * as Types from "../..";

@serializable
export class Ethereum_TxReceipt {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  to: string;
  m_from: string;
  contractAddress: string;
  transactionIndex: u32;
  root: string | null;
  gasUsed: BigInt;
  logsBloom: string;
  transactionHash: string;
  logs: Array<Types.Ethereum_Log>;
  blockNumber: BigInt;
  blockHash: string;
  confirmations: u32;
  cumulativeGasUsed: BigInt;
  effectiveGasPrice: BigInt;
  byzantium: bool;
  m_type: u32;
  status: Nullable<u32>;

  static toBuffer(type: Ethereum_TxReceipt): ArrayBuffer {
    return serializeEthereum_TxReceipt(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_TxReceipt {
    return deserializeEthereum_TxReceipt(buffer);
  }

  static write(writer: Write, type: Ethereum_TxReceipt): void {
    writeEthereum_TxReceipt(writer, type);
  }

  static read(reader: Read): Ethereum_TxReceipt {
    return readEthereum_TxReceipt(reader);
  }

  static toJson(type: Ethereum_TxReceipt): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Ethereum_TxReceipt {
    return (new JSONDeserializer(json)).decode<Ethereum_TxReceipt>();
  }
}
