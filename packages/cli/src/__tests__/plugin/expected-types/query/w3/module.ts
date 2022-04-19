/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_sanitizeEnv extends Record<string, unknown> {
  env: Types.ClientQueryEnv;
}

export interface Input_method extends Record<string, unknown> {
  str: Types.String;
  optStr?: Types.String | null;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<
  TConfig,
  Types.Env,
  Types.ClientQueryEnv
> {
  constructor(config: TConfig) {
    super(config);
  }

  abstract sanitizeEnv(
    input: Input_sanitizeEnv,
    client: Client
  ): MaybeAsync<Types.Env>;

  abstract method(
    input: Input_method,
    client: Client
  ): MaybeAsync<Types.Object>;
}
