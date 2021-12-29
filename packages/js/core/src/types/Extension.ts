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

export interface ExtensionConfig {
  uri: Uri | string;
}

export abstract class Extension {
  client: Client;
  uri: Uri;

  constructor(client: Client, config: ExtensionConfig) {
    this.client = client;
    if (typeof config.uri === "string") {
      this.uri = new Uri(config.uri);
    } else {
      this.uri = config.uri as Uri;
    }
  }
}

export type ExtensionPackage = {
  factory: (client: Client) => Extension;
};

export type ExtensionFactory<TOpts> = (opts: TOpts) => ExtensionPackage;
