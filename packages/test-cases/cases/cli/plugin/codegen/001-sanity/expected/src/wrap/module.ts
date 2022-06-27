/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_methodOne extends Record<string, unknown> {
  str: Types.String;
  optStr?: Types.String | null;
}

export interface Args_methodTwo extends Record<string, unknown> {
  arg: Types.UInt32;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig,
  Types.Env
> {

  abstract methodOne(
    args: Args_methodOne,
    client: Client
  ): MaybeAsync<Types.Object>;

  abstract methodTwo(
    args: Args_methodTwo,
    client: Client
  ): MaybeAsync<Types.String>;
}
