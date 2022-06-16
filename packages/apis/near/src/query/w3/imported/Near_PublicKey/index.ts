import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeNear_PublicKey,
  deserializeNear_PublicKey,
  writeNear_PublicKey,
  readNear_PublicKey
} from "./serialization";
import * as Types from "../..";

export class Near_PublicKey {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  keyType: Types.Near_KeyType;
  data: ArrayBuffer;

  static toBuffer(type: Near_PublicKey): ArrayBuffer {
    return serializeNear_PublicKey(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Near_PublicKey {
    return deserializeNear_PublicKey(buffer);
  }

  static write(writer: Write, type: Near_PublicKey): void {
    writeNear_PublicKey(writer, type);
  }

  static read(reader: Read): Near_PublicKey {
    return readNear_PublicKey(reader);
  }
}
