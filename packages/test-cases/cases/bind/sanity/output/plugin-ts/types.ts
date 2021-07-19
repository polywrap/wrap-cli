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
  optStr?: String;
  u: UInt;
  optU?: UInt;
  u8: UInt8;
  u16: UInt16;
  u32: UInt32;
  i: Int;
  i8: Int8;
  i16: Int16;
  i32: Int32;
  bigint: BigInt;
  optBigint?: BigInt;
  bytes: Bytes;
  optBytes?: Bytes;
  boolean: Boolean;
  optBoolean?: Boolean;
  uArray: Array<UInt>;
  uOptArray?: Array<UInt>;
  optUOptArray?: Array<(UInt | undefined)>;
  optStrOptArray?: Array<(String | undefined)>;
  uArrayArray: Array<Array<UInt>>;
  uOptArrayOptArray: Array<Array<(UInt32 | undefined)> | undefined>;
  uArrayOptArrayArray: Array<Array<Array<UInt32>> | undefined>;
  crazyArray?: Array<Array<Array<Array<UInt32> | undefined>> | undefined>;
  object: AnotherType;
  optObject?: AnotherType;
  objectArray: Array<AnotherType>;
  optObjectArray?: Array<AnotherType | undefined>;
  en: CustomEnum;
  optEnum?: CustomEnum;
  enumArray: Array<CustomEnum>;
  optEnumArray?: CustomEnum[];
}

export interface AnotherType {
  prop?: String;
  circular?: CustomType;
}

export enum CustomEnum {
  STRING,
  BYTES
}

/// Imported Objects START ///

/* URI: "testimport.uri.eth" */
export interface TestImport_Object {
  object: TestImport_AnotherObject;
  optObject?: TestImport_AnotherObject;
  objectArray: Array<TestImport_AnotherObject>;
  optObjectArray?: Array<TestImport_AnotherObject | undefined>;
  en: TestImport_Enum;
  optEnum?: TestImport_Enum;
  enumArray: Array<TestImport_Enum>;
  optEnumArray?: Array<TestImport_Enum | undefined>;
}

/* URI: "testimport.uri.eth" */
export interface TestImport_AnotherObject {
  prop: String;
}

/* URI: "testimport.uri.eth" */
export enum TestImport_Enum {
  STRING,
  BYTES
}

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "testimport.uri.eth" */
interface TestImport_Query_Input_importedMethod extends Record<string, unknown> {
  str: String;
  optStr?: String;
  u: UInt;
  optU?: UInt;
  uArrayArray: Array<Array<UInt | undefined> | undefined>;
  object: TestImport_Object;
  optObject?: TestImport_Object;
  objectArray: Array<TestImport_Object>;
  optObjectArray?: Array<TestImport_Object | undefined>;
  en: TestImport_Enum;
  optEnum?: TestImport_Enum;
  enumArray: Array<TestImport_Enum>;
  optEnumArray?: Array<TestImport_Enum | undefined>
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
  ): Promise<InvokeApiResult<TestImport_Object>> => {
    return client.invoke<TestImport_Object>({
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
  object: TestImport_Object;
  objectArray: Array<TestImport_Object>;
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
  ): Promise<InvokeApiResult<TestImport_Object>> => {
    return client.invoke<TestImport_Object>({
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
