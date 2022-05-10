import {
  Read,
  Write,
  Nullable,
  BigInt,
  BigNumber,
  JSON
} from "@web3api/wasm-as";
import {
  serializeQueryEnv,
  deserializeQueryEnv,
  writeQueryEnv,
  readQueryEnv
} from "./serialization";
import * as Types from "..";

@serializable
export class QueryEnv {
  queryProp: string;
  optMap: Map<string, Nullable<i32>> | null;
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
