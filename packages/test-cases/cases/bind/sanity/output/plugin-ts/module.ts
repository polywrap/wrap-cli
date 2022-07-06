/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_moduleMethod extends Record<string, unknown> {
  str: Types.String;
  optStr?: Types.String | null;
  en: Types.CustomEnum;
  optEnum?: Types.CustomEnum | null;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray?: Array<Types.CustomEnum | null> | null;
  map: Map<Types.String, Types.Int>;
}

export interface Args_objectMethod extends Record<string, unknown> {
  object: Types.AnotherType;
  optObject?: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | null> | null;
}

export interface Args_optionalEnvMethod extends Record<string, unknown> {
  object: Types.AnotherType;
  optObject?: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | null> | null;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig,
  Types.Env
> {

  abstract moduleMethod(
    args: Args_moduleMethod,
    client: Client
  ): MaybeAsync<Types.Int>;

  abstract objectMethod(
    args: Args_objectMethod,
    client: Client
  ): MaybeAsync<Types.AnotherType | null>;

  abstract optionalEnvMethod(
    args: Args_optionalEnvMethod,
    client: Client
  ): MaybeAsync<Types.AnotherType | null>;
}
