import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeQueryResponseKind,
  deserializeQueryResponseKind,
  writeQueryResponseKind,
  readQueryResponseKind
} from "./serialization";
import * as Types from "..";

export class QueryResponseKind {
  blockHeight: BigInt;
  blockHash: string;

  static toBuffer(type: QueryResponseKind): ArrayBuffer {
    return serializeQueryResponseKind(type);
  }

  static fromBuffer(buffer: ArrayBuffer): QueryResponseKind {
    return deserializeQueryResponseKind(buffer);
  }

  static write(writer: Write, type: QueryResponseKind): void {
    writeQueryResponseKind(writer, type);
  }

  static read(reader: Read): QueryResponseKind {
    return readQueryResponseKind(reader);
  }
}
