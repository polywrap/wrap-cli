// @ts-noCheck
import {
  UInt,
  UInt8,
  UInt16,
  UInt32,
  Int,
  Int8,
  Int16,
  Int32,
  Bytes,
  BigInt,
  Json,
  String,
  Boolean
} from "./types";

import {
  CustomType,
  AnotherType,
  CustomEnumEnum,
  CustomEnumString,
  CustomEnum,
  TestImport_Object,
  TestImport_AnotherObject,
  TestImport_EnumEnum,
  TestImport_EnumString,
  TestImport_Enum,
  TestImport_Query,
  TestImport_Mutation,
} from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_mutationMethod extends Record<string, unknown> {
  str: String;
  optStr?: String | null;
  en: CustomEnum;
  optEnum?: CustomEnum | null;
  enumArray: Array<CustomEnum>;
  optEnumArray?: Array<CustomEnum | null> | null;
}

export interface Input_objectMethod extends Record<string, unknown> {
  object: AnotherType;
  optObject?: AnotherType | null;
  objectArray: Array<AnotherType>;
  optObjectArray?: Array<AnotherType | null> | null;
}

export interface Module extends PluginModule {
  mutationMethod(
    input: Input_mutationMethod,
    client: Client
  ): MaybeAsync<Int>;

  objectMethod(
    input: Input_objectMethod,
    client: Client
  ): MaybeAsync<AnotherType | null>;
}
