import {
  Read,
  Write,
  Box,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeEnv,
  deserializeEnv,
  writeEnv,
  readEnv
} from "./serialization";
import * as Types from "..";

export class Env {
  prop: string;
  optProp: string | null;
  optMap: Map<string, Box<i32> | null> | null;

  static toBuffer(type: Env): ArrayBuffer {
    return serializeEnv(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Env {
    return deserializeEnv(buffer);
  }

  static write(writer: Write, type: Env): void {
    writeEnv(writer, type);
  }

  static read(reader: Read): Env {
    return readEnv(reader);
  }
}
