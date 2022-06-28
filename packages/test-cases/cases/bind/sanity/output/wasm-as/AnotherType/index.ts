import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
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
  const: string | null;

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
