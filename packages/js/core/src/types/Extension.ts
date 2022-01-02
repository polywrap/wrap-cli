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
  uri?: Uri | string;
}

export interface Extension {
  readonly client: Client;
  readonly uri: Uri;
  config: ExtensionConfig;
}

export type ExtensionPackage = {
  factory: (client: Client) => Extension;
  namespace: string;
};

export type ExtensionFactory<TOpts> = (opts: TOpts) => ExtensionPackage;
