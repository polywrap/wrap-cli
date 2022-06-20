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
  serializeEthereum_Connection,
  deserializeEthereum_Connection,
  writeEthereum_Connection,
  readEthereum_Connection
} from "./serialization";
import * as Types from "../..";

@serializable
export class Ethereum_Connection {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  node: string | null;
  networkNameOrChainId: string | null;

  static toBuffer(type: Ethereum_Connection): ArrayBuffer {
    return serializeEthereum_Connection(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_Connection {
    return deserializeEthereum_Connection(buffer);
  }

  static write(writer: Write, type: Ethereum_Connection): void {
    writeEthereum_Connection(writer, type);
  }

  static read(reader: Read): Ethereum_Connection {
    return readEthereum_Connection(reader);
  }

  static toJson(type: Ethereum_Connection): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Ethereum_Connection {
    return (new JSONDeserializer(json)).decode<Ethereum_Connection>();
  }
}
