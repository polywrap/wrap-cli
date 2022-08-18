/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_sha3_512 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_sha3_384 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_sha3_256 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_sha3_224 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_keccak_512 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_keccak_384 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_keccak_256 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_keccak_224 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_hex_keccak_256 extends Record<string, unknown> {
  message: Types.String;
}

export interface Args_buffer_keccak_256 extends Record<string, unknown> {
  message: Types.Bytes;
}

export interface Args_shake_128 extends Record<string, unknown> {
  message: Types.String;
  outputBits: Types.Int;
}

export interface Args_shake_256 extends Record<string, unknown> {
  message: Types.String;
  outputBits: Types.Int;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract sha3_512(
    args: Args_sha3_512,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sha3_384(
    args: Args_sha3_384,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sha3_256(
    args: Args_sha3_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sha3_224(
    args: Args_sha3_224,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_512(
    args: Args_keccak_512,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_384(
    args: Args_keccak_384,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_256(
    args: Args_keccak_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_224(
    args: Args_keccak_224,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract hex_keccak_256(
    args: Args_hex_keccak_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract buffer_keccak_256(
    args: Args_buffer_keccak_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract shake_128(
    args: Args_shake_128,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract shake_256(
    args: Args_shake_256,
    client: Client
  ): MaybeAsync<Types.String>;
}
