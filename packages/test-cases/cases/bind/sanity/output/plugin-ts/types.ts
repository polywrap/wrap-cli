/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeResult
} from "@polywrap/core-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type BigNumber = string;
export type BigFraction = Array<BigInt>;
export type Fraction<T extends number> = Array<T>;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Envs START ///
export interface Env extends Record<string, unknown> {
  prop: Types.String;
  optProp?: Types.String | null;
  optMap?: Map<Types.String, Types.Int | undefined> | null;
}
/// Envs END ///

/// Objects START ///
export interface CustomType {
  str: Types.String;
  optStr?: Types.String | null;
  u: Types.UInt;
  optU?: Types.UInt | null;
  u8: Types.UInt8;
  u16: Types.UInt16;
  u32: Types.UInt32;
  i: Types.Int;
  i8: Types.Int8;
  i16: Types.Int16;
  i32: Types.Int32;
  bigint: Types.BigInt;
  optBigint?: Types.BigInt | null;
  bignumber: Types.BigNumber;
  optBignumber?: Types.BigNumber | null;
  bigfraction: Types.BigFraction;
  optBigfraction?: Types.BigFraction | null;
  fraction: Types.Fraction<Types.Int32>;
  optFraction?: Types.Fraction<Types.Int32> | null;
  json: Types.Json;
  optJson?: Types.Json | null;
  bytes: Types.Bytes;
  optBytes?: Types.Bytes | null;
  boolean: Types.Boolean;
  optBoolean?: Types.Boolean | null;
  uArray: Array<Types.UInt>;
  uOptArray?: Array<Types.UInt> | null;
  optUOptArray?: Array<Types.UInt | null> | null;
  optStrOptArray?: Array<Types.String | null> | null;
  uArrayArray: Array<Array<Types.UInt>>;
  uOptArrayOptArray: Array<Array<Types.UInt32 | null> | null>;
  uArrayOptArrayArray: Array<Array<Array<Types.UInt32>> | null>;
  crazyArray?: Array<Array<Array<Array<Types.UInt32> | null>> | null> | null;
  object: Types.AnotherType;
  optObject?: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | null> | null;
  en: Types.CustomEnum;
  optEnum?: Types.CustomEnum | null;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray?: Array<Types.CustomEnum | null> | null;
}

export interface AnotherType {
  prop?: Types.String | null;
  circular?: Types.CustomType | null;
  const?: Types.String | null;
}

/// Objects END ///

/// Enums START ///
export enum CustomEnumEnum {
  STRING,
  BYTES,
}

export type CustomEnumString =
  | "STRING"
  | "BYTES"

export type CustomEnum = CustomEnumEnum | CustomEnumString;

/// Enums END ///

/// Imported Objects START ///

/* URI: "testimport.uri.eth" */
export interface TestImport_Object {
  object: Types.TestImport_AnotherObject;
  optObject?: Types.TestImport_AnotherObject | null;
  objectArray: Array<Types.TestImport_AnotherObject>;
  optObjectArray?: Array<Types.TestImport_AnotherObject | null> | null;
  en: Types.TestImport_Enum;
  optEnum?: Types.TestImport_Enum | null;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray?: Array<Types.TestImport_Enum | null> | null;
}

/* URI: "testimport.uri.eth" */
export interface TestImport_AnotherObject {
  prop: Types.String;
}

/* URI: "testimport.uri.eth" */
export enum TestImport_EnumEnum {
  STRING,
  BYTES,
}

export type TestImport_EnumString =
  | "STRING"
  | "BYTES"

export type TestImport_Enum = TestImport_EnumEnum | TestImport_EnumString;

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "testimport.uri.eth" */
interface TestImport_Module_Args_importedMethod extends Record<string, unknown> {
  str: Types.String;
  optStr?: Types.String | null;
  u: Types.UInt;
  optU?: Types.UInt | null;
  uArrayArray: Array<Array<Types.UInt | null> | null>;
  object: Types.TestImport_Object;
  optObject?: Types.TestImport_Object | null;
  objectArray: Array<Types.TestImport_Object>;
  optObjectArray?: Array<Types.TestImport_Object | null> | null;
  en: Types.TestImport_Enum;
  optEnum?: Types.TestImport_Enum | null;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray?: Array<Types.TestImport_Enum | null> | null;
}

/* URI: "testimport.uri.eth" */
interface TestImport_Module_Args_anotherMethod extends Record<string, unknown> {
  arg: Array<Types.String>;
}

/* URI: "testimport.uri.eth" */
export class TestImport_Module {
  public static interfaceUri: string = "testimport.uri.eth";

  constructor(public uri: string) {
  }

  public async importedMethod (
    args: TestImport_Module_Args_importedMethod,
    client: Client
  ): Promise<InvokeResult<Types.TestImport_Object | null>> {
    return client.invoke<Types.TestImport_Object | null>({
      uri: this.uri,
      method: "importedMethod",
      args
    });
  }

  public async anotherMethod (
    args: TestImport_Module_Args_anotherMethod,
    client: Client
  ): Promise<InvokeResult<Types.Int32>> {
    return client.invoke<Types.Int32>({
      uri: this.uri,
      method: "anotherMethod",
      args
    });
  }
}

/// Imported Modules END ///

export class TestImport {
  static uri: string = "testimport.uri.eth";

  public static getImplementations(client: Client): string[] {
    return client.getImplementations(this.uri, {});
  }
}
