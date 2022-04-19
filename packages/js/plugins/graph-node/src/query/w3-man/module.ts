/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@web3api/core-js";

export interface Input_querySubgraph extends Record<string, unknown> {
  subgraphAuthor: Types.String;
  subgraphName: Types.String;
  query: Types.String;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig> {
  abstract querySubgraph(
    input: Input_querySubgraph,
    client: Client
  ): MaybeAsync<Types.String>;
}
