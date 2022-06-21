import {
  Read,
  Write,
  Option,
  BigInt,
  BigNumber,
  JSON,
  JSONSerializer,
  JSONDeserializer,
} from "@polywrap/wasm-as";
import {
  serializeCustomType,
  deserializeCustomType,
  writeCustomType,
  readCustomType
} from "./serialization";
import * as Types from "..";

@serializable
export class CustomType {
  str: string;
  optStr: Option<string>;
  u: u32;
  optU: Option<u32>;
  m_u8: u8;
  m_u16: u16;
  m_u32: u32;
  i: i32;
  m_i8: i8;
  m_i16: i16;
  m_i32: i32;
  bigint: BigInt;
  optBigint: Option<BigInt>;
  bignumber: BigNumber;
  optBignumber: Option<BigNumber>;
  json: JSON.Value;
  optJson: Option<JSON.Value>;
  bytes: ArrayBuffer;
  optBytes: Option<ArrayBuffer>;
  m_boolean: bool;
  optBoolean: Option<bool>;
  uArray: Array<u32>;
  uOptArray: Option<Array<u32>>;
  optUOptArray: Option<Array<Option<u32>>>;
  optStrOptArray: Option<Array<Option<string>>>;
  uArrayArray: Array<Array<u32>>;
  uOptArrayOptArray: Array<Option<Array<Option<u32>>>>;
  uArrayOptArrayArray: Array<Option<Array<Array<u32>>>>;
  crazyArray: Option<Array<Option<Array<Array<Option<Array<u32>>>>>>>;
  object: Types.AnotherType;
  optObject: Option<Types.AnotherType>;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Option<Array<Option<Types.AnotherType>>>;
  en: Types.CustomEnum;
  optEnum: Option<Types.CustomEnum>;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray: Option<Array<Option<Types.CustomEnum>>>;

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

  static toJson(type: CustomType): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): CustomType {
    return (new JSONDeserializer(json)).decode<CustomType>();
  }
}
