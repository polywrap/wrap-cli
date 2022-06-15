/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@polywrap/core-js";

export interface Input_toAscii extends Record<string, unknown> {
  value: Types.String;
}

export interface Input_toUnicode extends Record<string, unknown> {
  value: Types.String;
}

export interface Input_convert extends Record<string, unknown> {
  value: Types.String;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig> {
  abstract toAscii(
    input: Input_toAscii,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract toUnicode(
    input: Input_toUnicode,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract convert(
    input: Input_convert,
    client: Client
  ): MaybeAsync<Types.ConvertResult>;
}
