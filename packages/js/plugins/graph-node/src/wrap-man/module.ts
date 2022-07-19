/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_querySubgraph extends Record<string, unknown> {
  subgraphAuthor: Types.String;
  subgraphName: Types.String;
  query: Types.String;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig
> {

  abstract querySubgraph(
    args: Args_querySubgraph,
    client: Client
  ): MaybeAsync<Types.String>;
}
