/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_cat extends Record<string, unknown> {
  cid: Types.String;
  options?: Types.Ipfs_Options | null;
}

export interface Args_resolve extends Record<string, unknown> {
  cid: Types.String;
  options?: Types.Ipfs_Options | null;
}

export interface Args_addFile extends Record<string, unknown> {
  data: Types.Bytes;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig,
  Types.Env
> {

  abstract cat(
    args: Args_cat,
    client: Client
  ): MaybeAsync<Types.Bytes>;

  abstract resolve(
    args: Args_resolve,
    client: Client
  ): MaybeAsync<Types.Ipfs_ResolveResult | null>;

  abstract addFile(
    args: Args_addFile,
    client: Client
  ): MaybeAsync<Types.String>;
}
