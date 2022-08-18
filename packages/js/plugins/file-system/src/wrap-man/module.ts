/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_readFile extends Record<string, unknown> {
  path: Types.String;
}

export interface Args_readFileAsString extends Record<string, unknown> {
  path: Types.String;
  encoding?: Types.FileSystem_Encoding | null;
}

export interface Args_exists extends Record<string, unknown> {
  path: Types.String;
}

export interface Args_writeFile extends Record<string, unknown> {
  path: Types.String;
  data: Types.Bytes;
}

export interface Args_mkdir extends Record<string, unknown> {
  path: Types.String;
  recursive?: Types.Boolean | null;
}

export interface Args_rm extends Record<string, unknown> {
  path: Types.String;
  recursive?: Types.Boolean | null;
  force?: Types.Boolean | null;
}

export interface Args_rmdir extends Record<string, unknown> {
  path: Types.String;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract readFile(
    args: Args_readFile,
    client: Client
  ): MaybeAsync<Types.Bytes>;

  abstract readFileAsString(
    args: Args_readFileAsString,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract exists(
    args: Args_exists,
    client: Client
  ): MaybeAsync<Types.Boolean>;

  abstract writeFile(
    args: Args_writeFile,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract mkdir(
    args: Args_mkdir,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract rm(
    args: Args_rm,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract rmdir(
    args: Args_rmdir,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;
}
