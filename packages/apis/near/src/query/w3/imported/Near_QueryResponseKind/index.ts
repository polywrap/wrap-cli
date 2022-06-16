import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as"
import {
  serializeNear_QueryResponseKind,
  deserializeNear_QueryResponseKind,
  writeNear_QueryResponseKind,
  readNear_QueryResponseKind
} from "./serialization";
import * as Types from "../..";

export class Near_QueryResponseKind {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  blockHeight: BigInt;
  blockHash: string;

  static toBuffer(type: Near_QueryResponseKind): ArrayBuffer {
    return serializeNear_QueryResponseKind(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Near_QueryResponseKind {
    return deserializeNear_QueryResponseKind(buffer);
  }

  static write(writer: Write, type: Near_QueryResponseKind): void {
    writeNear_QueryResponseKind(writer, type);
  }

  static read(reader: Read): Near_QueryResponseKind {
    return readNear_QueryResponseKind(reader);
  }
}
