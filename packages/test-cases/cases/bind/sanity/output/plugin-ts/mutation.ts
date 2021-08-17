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
  String,
  Boolean
} from "./types";
import * as Types from "./types";

import {
  Client,
  PluginModule
} from "@web3api/core-js";

export interface Input_mutationMethod extends Record<string, unknown> {
  str: String;
  optStr?: String | undefined;
  en: Types.CustomEnum;
  optEnum?: Types.CustomEnum | undefined;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray?: Array<Types.CustomEnum | undefined> | undefined;
}

export interface Input_objectMethod extends Record<string, unknown> {
  object: Types.AnotherType;
  optObject?: Types.AnotherType | undefined;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | undefined> | undefined;
}

export interface Module extends PluginModule {
  mutationMethod(
    input: Input_mutationMethod,
    client: Client
  ): Promise<Int>;

  objectMethod(
    input: Input_objectMethod,
    client: Client
  ): Promise<Types.AnotherType | undefined>;
}
