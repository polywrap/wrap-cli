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
import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_toAscii extends Record<string, unknown> {
  value: String;
}

export interface Input_toUnicode extends Record<string, unknown> {
  value: String;
}

export interface Input_convert extends Record<string, unknown> {
  value: String;
}

export abstract class Module<
  TConfig = {},
> extends PluginModule<
  TConfig,
> {
  abstract toAscii(
    input: Input_toAscii,
    client: Client
  ): MaybeAsync<String>;

  abstract toUnicode(
    input: Input_toUnicode,
    client: Client
  ): MaybeAsync<String>;

  abstract convert(
    input: Input_convert,
    client: Client
  ): MaybeAsync<Types.ConvertResult>;
}
