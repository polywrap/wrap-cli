/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@polywrap/core-js";

export interface Input_log extends Record<string, unknown> {
  level: Types.Logger_LogLevel;
  message: Types.String;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig> {
  abstract log(input: Input_log, client: Client): MaybeAsync<Types.Boolean>;
}
