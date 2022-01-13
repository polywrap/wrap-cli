import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeQueryEnv,
  deserializeQueryEnv,
  writeQueryEnv,
  readQueryEnv
} from "./serialization";
import * as Types from "..";

export class QueryEnv {
  queryProp: string;
  prop: string;
  optProp: string | null;

  static toBuffer(type: QueryEnv): ArrayBuffer {
    return serializeQueryEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): QueryEnv {
    return deserializeQueryEnv(buffer);
  }

  static write(writer: Write, type: QueryEnv): void {
    writeQueryEnv(writer, type);
  }

  static read(reader: Read): QueryEnv {
    return readQueryEnv(reader);
  }
}
