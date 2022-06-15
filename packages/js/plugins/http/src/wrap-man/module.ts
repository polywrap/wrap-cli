/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@polywrap/core-js";

export interface Input_get extends Record<string, unknown> {
  url: Types.String;
  request?: Types.Request | null;
}

export interface Input_post extends Record<string, unknown> {
  url: Types.String;
  request?: Types.Request | null;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig> {
  abstract get(
    input: Input_get,
    client: Client
  ): MaybeAsync<Types.Response | null>;

  abstract post(
    input: Input_post,
    client: Client
  ): MaybeAsync<Types.Response | null>;
}
