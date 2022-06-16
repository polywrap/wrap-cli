import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeEthereum_Access,
  deserializeEthereum_Access,
  writeEthereum_Access,
  readEthereum_Access
} from "./serialization";
import * as Types from "../..";

export class Ethereum_Access {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  address: string;
  storageKeys: Array<string>;

  static toBuffer(type: Ethereum_Access): ArrayBuffer {
    return serializeEthereum_Access(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Ethereum_Access {
    return deserializeEthereum_Access(buffer);
  }

  static write(writer: Write, type: Ethereum_Access): void {
    writeEthereum_Access(writer, type);
  }

  static read(reader: Read): Ethereum_Access {
    return readEthereum_Access(reader);
  }
}
