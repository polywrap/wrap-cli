/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./types";

// @ts-ignore
import { CoreClient, MaybeAsync } from "@polywrap/core-js";
import { PluginModule } from "@polywrap/plugin-js";

export interface Args_methodOne {
  str: Types.String;
  optStr?: Types.String | null;
}

export interface Args_methodTwo {
  arg: Types.UInt32;
}

export abstract class Module<TConfig> extends PluginModule<TConfig, Types.Env> {
  abstract methodOne(
    args: Args_methodOne,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Object>;

  abstract methodTwo(
    args: Args_methodTwo,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.String>;
}
