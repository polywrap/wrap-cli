import { Client } from "./Client";
import { Uri } from "./Uri";
import { InvokeApiOptions, InvokeApiResult } from "./Invoke";

export interface ExtensionInvocation<
  TData = unknown,
  TUri extends Uri | string = string
> {
  config: () => InvokeApiOptions<TUri>;
  execute: () => Promise<InvokeApiResult<TData>>;
}

export abstract class Extension<TUri extends Uri | string = string> {
  readonly client: Client;
  readonly uri: TUri;

  constructor(client: Client, uri: TUri) {
    this.client = client;
    this.uri = uri;
  }
}
