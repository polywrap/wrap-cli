import {
  Read,
  Write,
  Box,
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
  optU: Box<u32> | null;
  _u8: u8;
  _u16: u16;
  _u32: u32;
  i: i32;
  _i8: i8;
  _i16: i16;
  _i32: i32;
  bigint: BigInt;
  optBigint: BigInt | null;
  bignumber: BigNumber;
  optBignumber: BigNumber | null;
  json: JSON.Value;
  optJson: JSON.Value | null;
  bytes: ArrayBuffer;
  optBytes: ArrayBuffer | null;
  _boolean: bool;
  optBoolean: Box<bool> | null;
  u_array: Array<u32>;
  uOpt_array: Array<u32> | null;
  _opt_uOptArray: Array<Box<u32> | null> | null;
  optStrOptArray: Array<string | null> | null;
  uArrayArray: Array<Array<u32>>;
  uOptArrayOptArray: Array<Array<Box<u32> | null> | null>;
  uArrayOptArrayArray: Array<Array<Array<u32>> | null>;
  crazyArray: Array<Array<Array<Array<u32> | null>> | null> | null;
  object: Types.AnotherType;
  optObject: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Array<Types.AnotherType | null> | null;
  en: Types.CustomEnum;
  optEnum: Box<Types.CustomEnum> | null;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray: Array<Box<Types.CustomEnum> | null> | null;
  map: Map<string, i32>;
  mapOfArr: Map<string, Array<i32>>;
  mapOfObj: Map<string, Types.AnotherType>;
  mapOfArrOfObj: Map<string, Array<Types.AnotherType>>;
  mapCustomValue: Map<string, Types.CustomMapValue | null>;

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
