/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@web3api/core-js";

export interface Input_addFile extends Record<string, unknown> {
  data: Types.Bytes;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig> {
  abstract addFile(
    input: Input_addFile,
    client: Client
  ): MaybeAsync<Types.String>;
}
