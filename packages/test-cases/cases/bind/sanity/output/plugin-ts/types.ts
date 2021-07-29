import * as Types from "./";

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
export type Bytes = ArrayBuffer;
export type BigInt = string;
export type String = string;
export type Boolean = boolean;

export interface CustomType {
  str: String;
  optStr?: String | undefined;
  u: UInt;
  optU?: UInt | undefined;
  u8: UInt8;
  u16: UInt16;
  u32: UInt32;
  i: Int;
  i8: Int8;
  i16: Int16;
  i32: Int32;
  bigint: BigInt;
  optBigint?: BigInt | undefined;
  bytes: Bytes;
  optBytes?: Bytes | undefined;
  boolean: Boolean;
  optBoolean?: Boolean | undefined;
  uArray: Array<UInt>;
  uOptArray?: Array<UInt> | undefined;
  optUOptArray?: Array<UInt | undefined> | undefined;
  optStrOptArray?: Array<String | undefined> | undefined;
  uArrayArray: Array<Array<UInt>>;
  uOptArrayOptArray: Array<Array<UInt32 | undefined> | undefined>;
  uArrayOptArrayArray: Array<Array<Array<UInt32>> | undefined>;
  crazyArray?: Array<Array<Array<Array<UInt32> | undefined>> | undefined> | undefined;
  object: Types.AnotherType;
  optObject?: Types.AnotherType | undefined;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | undefined> | undefined;
  en: Types.CustomEnum;
  optEnum?: Types.CustomEnum | undefined;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray?: Array<Types.CustomEnum | undefined> | undefined;
}

export interface AnotherType {
  prop?: String | undefined;
  circular?: Types.CustomType | undefined;
}

export enum CustomEnum {
  STRING,
  BYTES,
}

/// Imported Objects START ///

/* URI: "testimport.uri.eth" */
export interface TestImport_Object {
  object: Types.TestImport_AnotherObject;
  optObject?: Types.TestImport_AnotherObject | undefined;
  objectArray: Array<Types.TestImport_AnotherObject>;
  optObjectArray?: Array<Types.TestImport_AnotherObject | undefined> | undefined;
  en: Types.TestImport_Enum;
  optEnum?: Types.TestImport_Enum | undefined;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray?: Array<Types.TestImport_Enum | undefined> | undefined;
}

/* URI: "testimport.uri.eth" */
export interface TestImport_AnotherObject {
  prop: String;
}

/* URI: "testimport.uri.eth" */
export enum TestImport_Enum {
  STRING,
  BYTES,
}

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "testimport.uri.eth" */
interface TestImport_Query_Input_importedMethod extends Record<string, unknown> {
  str: String;
  optStr?: String | undefined;
  u: UInt;
  optU?: UInt | undefined;
  uArrayArray: Array<Array<UInt | undefined> | undefined>;
  object: Types.TestImport_Object;
  optObject?: Types.TestImport_Object | undefined;
  objectArray: Array<Types.TestImport_Object>;
  optObjectArray?: Array<Types.TestImport_Object | undefined> | undefined;
  en: Types.TestImport_Enum;
  optEnum?: Types.TestImport_Enum | undefined;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray?: Array<Types.TestImport_Enum | undefined> | undefined;
}

/* URI: "testimport.uri.eth" */
interface TestImport_Query_Input_anotherMethod extends Record<string, unknown> {
  arg: Array<String>;
}

/* URI: "testimport.uri.eth" */
export const TestImport_Query = {
  importedMethod: async (
    input: TestImport_Query_Input_importedMethod,
    client: Client
  ): Promise<InvokeApiResult<Types.TestImport_Object | undefined>> => {
    return client.invoke<Types.TestImport_Object | undefined>({
      uri: "testimport.uri.eth",
      module: "query",
      method: "importedMethod",
      input
    });
  },

  anotherMethod: async (
    input: TestImport_Query_Input_anotherMethod,
    client: Client
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri: "testimport.uri.eth",
      module: "query",
      method: "anotherMethod",
      input
    });
  }
}

/* URI: "testimport.uri.eth" */
interface TestImport_Mutation_Input_importedMethod extends Record<string, unknown> {
  str: String;
  object: Types.TestImport_Object;
  objectArray: Array<Types.TestImport_Object>;
}

/* URI: "testimport.uri.eth" */
interface TestImport_Mutation_Input_anotherMethod extends Record<string, unknown> {
  arg: Array<String>;
}

/* URI: "testimport.uri.eth" */
export const TestImport_Mutation = {
  importedMethod: async (
    input: TestImport_Mutation_Input_importedMethod,
    client: Client
  ): Promise<InvokeApiResult<Types.TestImport_Object | undefined>> => {
    return client.invoke<Types.TestImport_Object | undefined>({
      uri: "testimport.uri.eth",
      module: "mutation",
      method: "importedMethod",
      input
    });
  },

  anotherMethod: async (
    input: TestImport_Mutation_Input_anotherMethod,
    client: Client
  ): Promise<InvokeApiResult<Int32>> => {
    return client.invoke<Int32>({
      uri: "testimport.uri.eth",
      module: "mutation",
      method: "anotherMethod",
      input
    });
  }
}

/// Imported Queries END ///
