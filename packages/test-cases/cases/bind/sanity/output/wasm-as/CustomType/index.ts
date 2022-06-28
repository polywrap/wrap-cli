import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON
} from "@polywrap/wasm-as";
import {
  serializeCustomType,
  deserializeCustomType,
  writeCustomType,
  readCustomType
} from "./serialization";
import * as Types from "..";

export class CustomType {
  str: string;
  optStr: string | null;
  u: u32;
  optU: Option<u32>;
  u8: u8;
  u16: u16;
  u32: u32;
  i: i32;
  i8: i8;
  i16: i16;
  i32: i32;
  bigint: BigInt;
  optBigint: BigInt | null;
  bignumber: BigNumber;
  optBignumber: BigNumber | null;
  json: JSON.Value;
  optJson: JSON.Value | null;
  bytes: ArrayBuffer;
  optBytes: ArrayBuffer | null;
  boolean: bool;
  optBoolean: Option<bool>;
  uArray: Array<u32>;
  uOptArray: Array<u32> | null;
  optUOptArray: Array<Option<u32>> | null;
  optStrOptArray: Array<string | null> | null;
  uArrayArray: Array<Array<u32>>;
  uOptArrayOptArray: Array<Array<Option<u32>> | null>;
  uArrayOptArrayArray: Array<Array<Array<u32>> | null>;
  crazyArray: Array<Array<Array<Array<u32> | null>> | null> | null;
  object: Types.AnotherType;
  optObject: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Array<Types.AnotherType | null> | null;
  en: Types.CustomEnum;
  optEnum: Option<Types.CustomEnum>;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray: Array<Option<Types.CustomEnum>> | null;

  static toBuffer(type: CustomType): ArrayBuffer {
    return serializeCustomType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): CustomType {
    return deserializeCustomType(buffer);
  }

  static write(writer: Write, type: CustomType): void {
    writeCustomType(writer, type);
  }

  static read(reader: Read): CustomType {
    return readCustomType(reader);
  }
}
