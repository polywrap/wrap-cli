import {
  Uri,
  Client,
  InvokeApiResult
} from "./";

export type QueryMethod = (
  input: Record<string, unknown>,
  client: Client
) => Promise<InvokeApiResult<unknown>>;

export type QueryResolver = Record<string, QueryMethod>;

export interface QueryResolvers {
  Query: QueryResolver;
  Mutation: QueryResolver;
}

export interface PluginConfig {
  imported?: Uri[];
  implemented?: Uri[];
}

export abstract class Plugin {

  constructor(protected _pluginConfig: PluginConfig) { }

  public isImplemented(uri: Uri): boolean {
    return this._pluginConfig.implemented !== undefined &&
           this._pluginConfig.implemented.findIndex((item) => item.uri === uri.uri) > -1;
  }

  public implements(): readonly Uri[] {
    return this._pluginConfig.implemented || [];
  }

  public imports(): readonly Uri[] {
    return this._pluginConfig.imported || [];
  }

  abstract getQueryResolvers(client: Client): QueryResolvers;
}
