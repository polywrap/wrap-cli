/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_log extends Record<string, unknown> {
  level: Types.Logger_LogLevel;
  message: Types.String;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract log(
    args: Args_log,
    client: Client
  ): MaybeAsync<Types.Boolean>;
}
