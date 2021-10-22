import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeYetAnotherObject,
  deserializeYetAnotherObject,
  writeYetAnotherObject,
  readYetAnotherObject
} from "./serialization";
import * as Types from "..";

export class YetAnotherObject {
  prop: boolean;

  static toBuffer(type: YetAnotherObject): ArrayBuffer {
    return serializeYetAnotherObject(type);
  }

  static fromBuffer(buffer: ArrayBuffer): YetAnotherObject {
    return deserializeYetAnotherObject(buffer);
  }

  static write(writer: Write, type: YetAnotherObject): void {
    writeYetAnotherObject(writer, type);
  }

  static read(reader: Read): YetAnotherObject {
    return readYetAnotherObject(reader);
  }
}
