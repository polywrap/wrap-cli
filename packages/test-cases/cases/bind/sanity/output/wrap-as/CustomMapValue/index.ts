import {
  Read,
  Write,
  Box,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeCustomMapValue,
  deserializeCustomMapValue,
  writeCustomMapValue,
  readCustomMapValue
} from "./serialization";
import * as Types from "..";

export class CustomMapValue {
  foo: string;

  static toBuffer(type: CustomMapValue): ArrayBuffer {
    return serializeCustomMapValue(type);
  }

  static fromBuffer(buffer: ArrayBuffer): CustomMapValue {
    return deserializeCustomMapValue(buffer);
  }

  static write(writer: Write, type: CustomMapValue): void {
    writeCustomMapValue(writer, type);
  }

  static read(reader: Read): CustomMapValue {
    return readCustomMapValue(reader);
  }
}
