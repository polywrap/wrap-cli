import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeAnotherObject,
  deserializeAnotherObject,
  writeAnotherObject,
  readAnotherObject
} from "./serialization";
import * as Types from "..";

export class AnotherObject {
  prop: string;

  static toBuffer(type: AnotherObject): ArrayBuffer {
    return serializeAnotherObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): AnotherObject {
    return deserializeAnotherObject(buffer);
  }

  static write(writer: Write, type: AnotherObject): void {
    writeAnotherObject(writer, type);
  }

  static read(reader: Read): AnotherObject {
    return readAnotherObject(reader);
  }
}
