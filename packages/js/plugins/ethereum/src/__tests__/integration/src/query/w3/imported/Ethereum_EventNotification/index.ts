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
  serializeEthereum_EventNotification,
  deserializeEthereum_EventNotification,
  writeEthereum_EventNotification,
  readEthereum_EventNotification
} from "./serialization";
import * as Types from "../..";

@serializable
export class Ethereum_EventNotification {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  data: string;
  address: string;
  log: Types.Ethereum_Log;

  static toBuffer(type: Ethereum_EventNotification): ArrayBuffer {
    return serializeEthereum_EventNotification(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_EventNotification {
    return deserializeEthereum_EventNotification(buffer);
  }

  static write(writer: Write, type: Ethereum_EventNotification): void {
    writeEthereum_EventNotification(writer, type);
  }

  static read(reader: Read): Ethereum_EventNotification {
    return readEthereum_EventNotification(reader);
  }

  static toJson(type: Ethereum_EventNotification): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Ethereum_EventNotification {
    return (new JSONDeserializer(json)).decode<Ethereum_EventNotification>();
  }
}
