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
  serializeEthereum_Network,
  deserializeEthereum_Network,
  writeEthereum_Network,
  readEthereum_Network
} from "./serialization";
import * as Types from "../..";

@serializable
export class Ethereum_Network {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  name: string;
  chainId: BigInt;
  ensAddress: string | null;

  static toBuffer(type: Ethereum_Network): ArrayBuffer {
    return serializeEthereum_Network(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_Network {
    return deserializeEthereum_Network(buffer);
  }

  static write(writer: Write, type: Ethereum_Network): void {
    writeEthereum_Network(writer, type);
  }

  static read(reader: Read): Ethereum_Network {
    return readEthereum_Network(reader);
  }

  static toJson(type: Ethereum_Network): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Ethereum_Network {
    return (new JSONDeserializer(json)).decode<Ethereum_Network>();
  }
}
