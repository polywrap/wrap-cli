/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./types";

// @ts-ignore
import { CoreClient, MaybeAsync } from "@polywrap/core-js";
import { PluginModule } from "@polywrap/plugin-js";

export interface Args_moduleMethod {
  str: Types.String;
  optStr?: Types.String | null;
  en: Types.CustomEnum;
  optEnum?: Types.CustomEnum | null;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray?: Array<Types.CustomEnum | null> | null;
  map: Map<Types.String, Types.Int>;
  mapOfArr: Map<Types.String, Array<Types.Int>>;
  mapOfMap: Map<Types.String, Map<Types.String, Types.Int>>;
  mapOfObj: Map<Types.String, Types.AnotherType>;
  mapOfArrOfObj: Map<Types.String, Array<Types.AnotherType>>;
}

export interface Args_objectMethod {
  object: Types.AnotherType;
  optObject?: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | null> | null;
}

export interface Args_optionalEnvMethod {
  object: Types.AnotherType;
  optObject?: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray?: Array<Types.AnotherType | null> | null;
}

export interface Args_if {
  if: Types._else;
}

export abstract class Module<TConfig> extends PluginModule<TConfig, Types.Env> {
  abstract moduleMethod(
    args: Args_moduleMethod,
    client: CoreClient
  ): MaybeAsync<Types.Int>;

  abstract objectMethod(
    args: Args_objectMethod,
    client: CoreClient
  ): MaybeAsync<Types.AnotherType | null>;

  abstract optionalEnvMethod(
    args: Args_optionalEnvMethod,
    client: CoreClient
  ): MaybeAsync<Types.AnotherType | null>;

  abstract if(
    args: Args_if,
    client: CoreClient
  ): MaybeAsync<Types._else>;
}
