/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_method extends Record<string, unknown> {
  str: Types.String;
  optStr?: Types.String | null;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<
  TConfig,
  Types.QueryEnv
> {

  abstract method(
    input: Input_method,
    client: Client
  ): MaybeAsync<Types.Object>;
}