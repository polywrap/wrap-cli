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

export interface Input_sanitizeEnv extends Record<string, unknown> {
  env: Types.ClientQueryEnv;
}

export interface Input_method extends Record<string, unknown> {
  str: String;
  optStr?: String | null;
}

export abstract class Module<
  TConfig = {}
> extends PluginModule<
  TConfig,
  Types.Env,
  Types.ClientQueryEnv,
> {
  constructor(config: TConfig) {
    super(config);
  }

  abstract sanitizeEnv(
    input: Input_sanitizeEnv,
    client: Client
  ): MaybeAsync<Types.Env>;

  abstract method(
    input: Input_method,
    client: Client
  ): MaybeAsync<Types.Object>;
}
