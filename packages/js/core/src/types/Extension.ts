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

export interface ExtensionConfig<TUri extends Uri | string = string> {
  uri: TUri;
}

export abstract class Extension {
  client: Client;
  uri: Uri;

  constructor(client: Client, config: ExtensionConfig<Uri | string>) {
    this.client = client;
    if (typeof config.uri === "string") {
      this.uri = new Uri(config.uri);
    } else {
      this.uri = config.uri as Uri;
    }
  }
}

export type ExtensionPackage = {
  factory: () => Extension;
};

export type ExtensionFactory<TOpts> = (
  client: Client,
  opts: TOpts
) => ExtensionPackage;
