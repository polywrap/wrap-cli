/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_toAscii extends Record<string, unknown> {
  value: Types.String;
}

export interface Args_toUnicode extends Record<string, unknown> {
  value: Types.String;
}

export interface Args_convert extends Record<string, unknown> {
  value: Types.String;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract toAscii(
    args: Args_toAscii,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract toUnicode(
    args: Args_toUnicode,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract convert(
    args: Args_convert,
    client: Client
  ): MaybeAsync<Types.ConvertResult>;
}
