import {
  Read,
  Write,
  Nullable,
  BigInt
} from "@web3api/wasm-as";
import {
  serializeAnotherType,
  deserializeAnotherType,
  writeAnotherType,
  readAnotherType
} from "./serialization";
import * as Types from "..";

export class AnotherType {
  prop: string | null;
  circular: Types.CustomType | null;

  static toBuffer(type: AnotherType): ArrayBuffer {
    return serializeAnotherType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): AnotherType {
    return deserializeAnotherType(buffer);
  }

  static write(writer: Write, type: AnotherType): void {
    writeAnotherType(writer, type);
  }

  static read(reader: Read): AnotherType {
    return readAnotherType(reader);
  }
}
