import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeelse,
  deserializeelse,
  writeelse,
  readelse
} from "./serialization";
import * as Types from "..";

export class _else {
  _else: string;

  static toBuffer(type: _else): ArrayBuffer {
    return serializeelse(type);
  }

  static fromBuffer(buffer: ArrayBuffer): _else {
    return deserializeelse(buffer);
  }

  static write(writer: Write, type: _else): void {
    writeelse(writer, type);
  }

  static read(reader: Read): _else {
    return readelse(reader);
  }
}
