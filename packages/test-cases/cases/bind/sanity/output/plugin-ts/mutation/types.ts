/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeApiResult
} from "@web3api/core-js";

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
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Envs START ///
export interface MutationEnv extends Record<string, unknown> {
  mutProp: Types.String;
  prop: Types.String;
  optProp?: Types.String | null;
}
/// Envs END ///

/// Objects START ///
export interface AnotherType {
  prop?: Types.String | null;
  circular?: Types.CustomType | null;
  const?: Types.String | null;
}

export interface AnotherObject {
  prop: Types.String;
}

export interface YetAnotherObject {
  prop: Types.Boolean;
}

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
  json: Json;
  optJson?: Json | null;
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
  union: Types.CustomUnion;
  optUnion?: Types.CustomUnion | null;
  unionArray: Array<Types.CustomUnion>;
  optUnionArray?: Array<Types.CustomUnion | null> | null;
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

/// Unions START ///

export type CustomUnion =
  | AnotherObject
  | YetAnotherObject

/// Unions END ///

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
  union: Types.TestImport_Union;
  optUnion?: Types.TestImport_Union | null;
  unionArray: Array<Types.TestImport_Union>;
  optUnionArray?: Array<Types.TestImport_Union | null> | null;
}

/* URI: "testimport.uri.eth" */
export interface TestImport_AnotherObject {
  prop: Types.String;
}

/* URI: "testimport.uri.eth" */
export interface TestImport_YetAnotherObject {
  prop: Types.Boolean;
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


/* URI: "testimport.uri.eth" */
export type TestImport_Union =
  | TestImport_AnotherObject
  | TestImport_YetAnotherObject
/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "testimport.uri.eth" */
interface TestImport_Query_Input_importedMethod extends Record<string, unknown> {
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
  union: Types.TestImport_Union;
  optUnion?: Types.TestImport_Union | null;
  unionArray: Array<Types.TestImport_Union>;
  optUnionArray?: Array<Types.TestImport_Union | null> | null;
}

/* URI: "testimport.uri.eth" */
interface TestImport_Query_Input_anotherMethod extends Record<string, unknown> {
  arg: Array<Types.String>;
}

/* URI: "testimport.uri.eth" */
export const TestImport_Query = {
  importedMethod: async (
    input: TestImport_Query_Input_importedMethod,
    client: Client
  ): Promise<InvokeApiResult<Types.TestImport_Object | null>> => {
    return client.invoke<Types.TestImport_Object | null>({
      uri: "testimport.uri.eth",
      module: "query",
      method: "importedMethod",
      input
    });
  },

  anotherMethod: async (
    input: TestImport_Query_Input_anotherMethod,
    client: Client
  ): Promise<InvokeApiResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri: "testimport.uri.eth",
      module: "query",
      method: "anotherMethod",
      input
    });
  }
}

/* URI: "testimport.uri.eth" */
interface TestImport_Mutation_Input_importedMethod extends Record<string, unknown> {
  str: Types.String;
  object: Types.TestImport_Object;
  objectArray: Array<Types.TestImport_Object>;
}

/* URI: "testimport.uri.eth" */
interface TestImport_Mutation_Input_anotherMethod extends Record<string, unknown> {
  arg: Array<Types.String>;
}

/* URI: "testimport.uri.eth" */
export const TestImport_Mutation = {
  importedMethod: async (
    input: TestImport_Mutation_Input_importedMethod,
    client: Client
  ): Promise<InvokeApiResult<Types.TestImport_Object | null>> => {
    return client.invoke<Types.TestImport_Object | null>({
      uri: "testimport.uri.eth",
      module: "mutation",
      method: "importedMethod",
      input
    });
  },

  anotherMethod: async (
    input: TestImport_Mutation_Input_anotherMethod,
    client: Client
  ): Promise<InvokeApiResult<Types.Int32>> => {
    return client.invoke<Types.Int32>({
      uri: "testimport.uri.eth",
      module: "mutation",
      method: "anotherMethod",
      input
    });
  }
}

/// Imported Queries END ///
