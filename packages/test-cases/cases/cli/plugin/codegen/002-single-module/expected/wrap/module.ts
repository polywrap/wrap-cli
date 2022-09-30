/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import { Client, MaybeAsync } from "@polywrap/core-js";
import { PluginModule } from "@polywrap/plugin-js";

export interface Args_method {
  str: Types.String;
  optStr?: Types.String | null;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig,
  Types.Env
> {

  abstract method(
    args: Args_method,
    client: Client
  ): MaybeAsync<Types.Object>;
}
