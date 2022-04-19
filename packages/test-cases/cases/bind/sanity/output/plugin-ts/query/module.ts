/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

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
import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_queryMethod extends Record<string, unknown> {
  str: String;
  optStr?: String | null;
  en: Types.CustomEnum;
  optEnum?: Types.CustomEnum | null;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray?: Array<Types.CustomEnum | null> | null;
  map: Map<String, Int>;
}

export interface Input_objectMethod extends Record<string, unknown> {
  object: Types.AnotherType;
  optObject?: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | null> | null;
}

export abstract class Module<
  TConfig = {}
> extends PluginModule<
  TConfig,
  Types.QueryEnv,
> {

  abstract queryMethod(
    input: Input_queryMethod,
    client: Client
  ): MaybeAsync<Int>;

  abstract objectMethod(
    input: Input_objectMethod,
    client: Client
  ): MaybeAsync<Types.AnotherType | null>;
}
