import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeNear_Signature,
  deserializeNear_Signature,
  writeNear_Signature,
  readNear_Signature
} from "./serialization";
import * as Types from "../..";

export class Near_Signature {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  keyType: Types.Near_KeyType;
  data: ArrayBuffer;

  static toBuffer(type: Near_Signature): ArrayBuffer {
    return serializeNear_Signature(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Near_Signature {
    return deserializeNear_Signature(buffer);
  }

  static write(writer: Write, type: Near_Signature): void {
    writeNear_Signature(writer, type);
  }

  static read(reader: Read): Near_Signature {
    return readNear_Signature(reader);
  }
}
