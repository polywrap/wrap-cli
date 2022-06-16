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
  serializeEthereum_Log,
  deserializeEthereum_Log,
  writeEthereum_Log,
  readEthereum_Log
} from "./serialization";
import * as Types from "../..";

@serializable
export class Ethereum_Log {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  blockNumber: BigInt;
  blockHash: string;
  transactionIndex: u32;
  removed: bool;
  address: string;
  data: string;
  topics: Array<string>;
  transactionHash: string;
  logIndex: u32;

  static toBuffer(type: Ethereum_Log): ArrayBuffer {
    return serializeEthereum_Log(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_Log {
    return deserializeEthereum_Log(buffer);
  }

  static write(writer: Write, type: Ethereum_Log): void {
    writeEthereum_Log(writer, type);
  }

  static read(reader: Read): Ethereum_Log {
    return readEthereum_Log(reader);
  }

  static toJson(type: Ethereum_Log): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Ethereum_Log {
    return (new JSONDeserializer(json)).decode<Ethereum_Log>();
  }
}
