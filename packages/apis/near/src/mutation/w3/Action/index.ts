import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeAction,
  deserializeAction,
  writeAction,
  readAction
} from "./serialization";
import * as Types from "..";

export class Action {

  static toBuffer(type: Action): ArrayBuffer {
    return serializeAction(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Action {
    return deserializeAction(buffer);
  }

  static write(writer: Write, type: Action): void {
    writeAction(writer, type);
  }

  static read(reader: Read): Action {
    return readAction(reader);
  }
}
