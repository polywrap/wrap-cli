/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_open extends Record<string, unknown> {
  url: Types.String;
  timeout?: Types.Number | null;
}

export interface Args_close extends Record<string, unknown> {
  id: Types.Int;
}

export interface Args_send extends Record<string, unknown> {
  id: Types.Int;
  message: Types.String;
}

export interface Args_addCallback extends Record<string, unknown> {
  id: Types.Int;
  callback: Types.Callback;
}

export interface Args_removeCallback extends Record<string, unknown> {
  id: Types.Int;
  callback: Types.Callback;
}

export interface Args_addCache extends Record<string, unknown> {
  id: Types.Int;
}

export interface Args_removeCache extends Record<string, unknown> {
  id: Types.Int;
}

export interface Args_receive extends Record<string, unknown> {
  id: Types.Int;
  min?: Types.Number | null;
  timeout?: Types.Number | null;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract open(
    args: Args_open,
    client: Client
  ): MaybeAsync<Types.Int>;

  abstract close(
    args: Args_close,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract send(
    args: Args_send,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract addCallback(
    args: Args_addCallback,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract removeCallback(
    args: Args_removeCallback,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract addCache(
    args: Args_addCache,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract removeCache(
    args: Args_removeCache,
    client: Client
  ): MaybeAsync<Types.Boolean | null>;

  abstract receive(
    args: Args_receive,
    client: Client
  ): MaybeAsync<Array<Types.Message>>;
}
