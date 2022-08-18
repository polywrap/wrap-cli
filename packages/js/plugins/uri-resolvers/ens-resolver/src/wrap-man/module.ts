/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_tryResolveUri extends Record<string, unknown> {
  authority: Types.String;
  path: Types.String;
}

export interface Args_getFile extends Record<string, unknown> {
  path: Types.String;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract tryResolveUri(
    args: Args_tryResolveUri,
    client: Client
  ): MaybeAsync<Types.UriResolver_MaybeUriOrManifest | null>;

  abstract getFile(
    args: Args_getFile,
    client: Client
  ): MaybeAsync<Types.Bytes | null>;
}
