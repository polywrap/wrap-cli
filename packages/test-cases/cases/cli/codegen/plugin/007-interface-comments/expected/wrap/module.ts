/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./types";

// @ts-ignore
import { CoreClient, MaybeAsync } from "@polywrap/core-js";
import { PluginModule } from "@polywrap/plugin-js";

export interface Args_methodA {
  arg: Types.String;
}

export interface Args_methodB {
  arg: Types.Bytes;
}

export abstract class Module<TConfig> extends PluginModule<TConfig> {
  abstract methodA(
    args: Args_methodA,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.String>;

  abstract methodB(
    args: Args_methodB,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Boolean>;
}
