/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_methodOne extends Record<string, unknown> {
  str: Types.String;
  optStr?: Types.String | null;
}

export interface Input_methodTwo extends Record<string, unknown> {
  arg: Types.UInt32;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<
  TConfig,
  Types.Env
> {

  abstract methodOne(
    input: Input_methodOne,
    client: Client
  ): MaybeAsync<Types.Object>;

  abstract methodTwo(
    input: Input_methodTwo,
    client: Client
  ): MaybeAsync<Types.String>;
}
