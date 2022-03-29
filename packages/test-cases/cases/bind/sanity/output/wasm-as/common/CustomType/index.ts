import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
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
  optU: Nullable<u32>;
  u8: u8;
  u16: u16;
  u32: u32;
  i: i32;
  i8: i8;
  i16: i16;
  i32: i32;
  bigint: BigInt;
  optBigint: BigInt | null;
  json: JSON.Value;
  optJson: JSON.Value | null;
  bytes: ArrayBuffer;
  optBytes: ArrayBuffer | null;
  boolean: bool;
  optBoolean: Nullable<bool>;
  uArray: Array<u32>;
  uOptArray: Array<u32> | null;
  optUOptArray: Array<Nullable<u32>> | null;
  optStrOptArray: Array<string | null> | null;
  uArrayArray: Array<Array<u32>>;
  uOptArrayOptArray: Array<Array<Nullable<u32>> | null>;
  uArrayOptArrayArray: Array<Array<Array<u32>> | null>;
  crazyArray: Array<Array<Array<Array<u32> | null>> | null> | null;
  object: Types.AnotherType;
  optObject: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Array<Types.AnotherType | null> | null;
  en: Types.CustomEnum;
  optEnum: Nullable<Types.CustomEnum>;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray: Array<Nullable<Types.CustomEnum>> | null;

  constructor(
    str: string,
    optStr: string | null,
    u: u32,
    optU: Nullable<u32>,
    m_u8: u8,
    m_u16: u16,
    m_u32: u32,
    i: i32,
    m_i8: i8,
    m_i16: i16,
    m_i32: i32,
    bigint: BigInt,
    optBigint: BigInt | null,
    json: JSON.Value,
    optJson: JSON.Value | null,
    bytes: ArrayBuffer,
    optBytes: ArrayBuffer | null,
    m_boolean: bool,
    optBoolean: Nullable<bool>,
    uArray: Array<u32>,
    uOptArray: Array<u32> | null,
    optUOptArray: Array<Nullable<u32>> | null,
    optStrOptArray: Array<string | null> | null,
    uArrayArray: Array<Array<u32>>,
    uOptArrayOptArray: Array<Array<Nullable<u32>> | null>,
    uArrayOptArrayArray: Array<Array<Array<u32>> | null>,
    crazyArray: Array<Array<Array<Array<u32> | null>> | null> | null,
    object: Types.AnotherType,
    optObject: Types.AnotherType | null,
    objectArray: Array<Types.AnotherType>,
    optObjectArray: Array<Types.AnotherType | null> | null,
    en: Types.CustomEnum,
    optEnum: Nullable<Types.CustomEnum>,
    enumArray: Array<Types.CustomEnum>,
    optEnumArray: Array<Nullable<Types.CustomEnum>> | null,
  ) {
    this.str = str;
    this.optStr = optStr;
    this.u = u;
    this.optU = optU;
    this.u8 = m_u8;
    this.u16 = m_u16;
    this.u32 = m_u32;
    this.i = i;
    this.i8 = m_i8;
    this.i16 = m_i16;
    this.i32 = m_i32;
    this.bigint = bigint;
    this.optBigint = optBigint;
    this.json = json;
    this.optJson = optJson;
    this.bytes = bytes;
    this.optBytes = optBytes;
    this.boolean = m_boolean;
    this.optBoolean = optBoolean;
    this.uArray = uArray;
    this.uOptArray = uOptArray;
    this.optUOptArray = optUOptArray;
    this.optStrOptArray = optStrOptArray;
    this.uArrayArray = uArrayArray;
    this.uOptArrayOptArray = uOptArrayOptArray;
    this.uArrayOptArrayArray = uArrayOptArrayArray;
    this.crazyArray = crazyArray;
    this.object = object;
    this.optObject = optObject;
    this.objectArray = objectArray;
    this.optObjectArray = optObjectArray;
    this.en = en;
    this.optEnum = optEnum;
    this.enumArray = enumArray;
    this.optEnumArray = optEnumArray;
  }

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
