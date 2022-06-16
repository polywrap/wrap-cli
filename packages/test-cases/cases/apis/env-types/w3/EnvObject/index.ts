import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeEnvObject,
  deserializeEnvObject,
  writeEnvObject,
  readEnvObject
} from "./serialization";
import * as Types from "..";

export class EnvObject {
  prop: string;

  static toBuffer(type: EnvObject): ArrayBuffer {
    return serializeEnvObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): EnvObject {
    return deserializeEnvObject(buffer);
  }

  static write(writer: Write, type: EnvObject): void {
    writeEnvObject(writer, type);
  }

  static read(reader: Read): EnvObject {
    return readEnvObject(reader);
  }
}
