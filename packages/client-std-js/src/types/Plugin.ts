import {
  Uri,
  QueryClient
} from ".";

export type QueryMethod = (
  input: Record<string, any>,
  client: QueryClient
) => Promise<Record<string, any>>;

export interface QueryResolvers {
  Query: Record<string, QueryMethod>;
  Mutation: Record<string, QueryMethod>;
}

export interface PluginConfig {
  import?: Uri[];
  implement?: Uri[];
}

export abstract class Plugin {

  constructor(protected _config: PluginConfig) { }

  public isImplemented(uri: Uri): boolean {
    return this._config.implement !== undefined &&
           this._config.implement.findIndex((item) => item.uri === uri.uri) > -1;
  }

  public implements(): Uri[] {
    return this._config.implement || [];
  }

  public imports(): Uri[] {
    return this._config.import || [];
  }

  abstract getQueryResolvers(client: QueryClient): QueryResolvers;
}
