/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_get extends Record<string, unknown> {
  url: Types.String;
  request?: Types.Request | null;
}

export interface Args_post extends Record<string, unknown> {
  url: Types.String;
  request?: Types.Request | null;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract get(
    args: Args_get,
    client: Client
  ): MaybeAsync<Types.Response | null>;

  abstract post(
    args: Args_post,
    client: Client
  ): MaybeAsync<Types.Response | null>;
}
