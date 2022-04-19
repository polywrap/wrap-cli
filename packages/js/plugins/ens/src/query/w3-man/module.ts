/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@web3api/core-js";

export interface Input_tryResolveUri extends Record<string, unknown> {
  authority: Types.String;
  path: Types.String;
}

export interface Input_getFile extends Record<string, unknown> {
  path: Types.String;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig> {
  constructor(config: TConfig) {
    super(config);
  }

  abstract tryResolveUri(
    input: Input_tryResolveUri,
    client: Client
  ): MaybeAsync<Types.UriResolver_MaybeUriOrManifest | null>;

  abstract getFile(
    input: Input_getFile,
    client: Client
  ): MaybeAsync<Types.Bytes | null>;
}
