/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@web3api/core-js";

export interface Input_sha3_512 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_sha3_384 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_sha3_256 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_sha3_224 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_keccak_512 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_keccak_384 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_keccak_256 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_keccak_224 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_hex_keccak_256 extends Record<string, unknown> {
  message: Types.String;
}

export interface Input_buffer_keccak_256 extends Record<string, unknown> {
  message: Types.Bytes;
}

export interface Input_shake_128 extends Record<string, unknown> {
  message: Types.String;
  outputBits: Types.Int;
}

export interface Input_shake_256 extends Record<string, unknown> {
  message: Types.String;
  outputBits: Types.Int;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig> {
  abstract sha3_512(
    input: Input_sha3_512,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sha3_384(
    input: Input_sha3_384,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sha3_256(
    input: Input_sha3_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sha3_224(
    input: Input_sha3_224,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_512(
    input: Input_keccak_512,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_384(
    input: Input_keccak_384,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_256(
    input: Input_keccak_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract keccak_224(
    input: Input_keccak_224,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract hex_keccak_256(
    input: Input_hex_keccak_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract buffer_keccak_256(
    input: Input_buffer_keccak_256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract shake_128(
    input: Input_shake_128,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract shake_256(
    input: Input_shake_256,
    client: Client
  ): MaybeAsync<Types.String>;
}
