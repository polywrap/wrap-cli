/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import { CoreClient, MaybeAsync } from "@polywrap/core-js";
import { PluginModule } from "@polywrap/plugin-js";

export interface Args_method {
  str: Types.String;
}

export abstract class Module<TConfig> extends PluginModule<TConfig, Types.Env> {
  abstract method(
    args: Args_method,
    client: CoreClient
  ): MaybeAsync<Types.String>;
}
