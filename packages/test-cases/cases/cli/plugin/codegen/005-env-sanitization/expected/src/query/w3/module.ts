/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_sanitizeEnv extends Record<string, unknown> {
  env: Types.QueryClientEnv;
}

export interface Input_method extends Record<string, unknown> {
  str: Types.String;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<
  TConfig,
  Types.QueryEnv,
  Types.QueryClientEnv
> {

  abstract sanitizeEnv(
    input: Input_sanitizeEnv,
    client: Client
  ): MaybeAsync<Types.QueryEnv>;

  abstract method(
    input: Input_method,
    client: Client
  ): MaybeAsync<Types.String>;
}