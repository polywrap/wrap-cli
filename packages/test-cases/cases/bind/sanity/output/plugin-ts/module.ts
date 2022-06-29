/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Input_moduleMethod extends Record<string, unknown> {
  str: Types.String;
  optStr?: Types.String | null;
  en: Types.CustomEnum;
  optEnum?: Types.CustomEnum | null;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray?: Array<Types.CustomEnum | null> | null;
  map: Map<Types.String, Types.Int>;
}

export interface Input_objectMethod extends Record<string, unknown> {
  object: Types.AnotherType;
  optObject?: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | null> | null;
}

export interface Input_optionalEnvMethod extends Record<string, unknown> {
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
    input: Input_moduleMethod,
    client: Client
  ): MaybeAsync<Types.Int>;

  abstract objectMethod(
    input: Input_objectMethod,
    client: Client
  ): MaybeAsync<Types.AnotherType | null>;

  abstract optionalEnvMethod(
    input: Input_optionalEnvMethod,
    client: Client
  ): MaybeAsync<Types.AnotherType | null>;
}
