/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Input_sanitizeEnv extends Record<string, unknown> {
  env: Types.ClientEnv;
}

export interface Input_method extends Record<string, unknown> {
  str: Types.String;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig,
  Types.Env,
  Types.ClientEnv
> {

  abstract sanitizeEnv(
    input: Input_sanitizeEnv,
    client: Client
  ): MaybeAsync<Types.Env>;

  abstract method(
    input: Input_method,
    client: Client
  ): MaybeAsync<Types.String>;
}
