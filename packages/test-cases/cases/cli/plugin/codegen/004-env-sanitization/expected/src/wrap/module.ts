/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_sanitizeEnv extends Record<string, unknown> {
  env: Types.ClientEnv;
}

export interface Args_method extends Record<string, unknown> {
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
    args: Args_sanitizeEnv,
    client: Client
  ): MaybeAsync<Types.Env>;

  abstract method(
    args: Args_method,
    client: Client
  ): MaybeAsync<Types.String>;
}
