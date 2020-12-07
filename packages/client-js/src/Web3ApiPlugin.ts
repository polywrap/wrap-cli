import { QueryClient } from "./graphql";
import { Uri } from "./";

export type Method = (
  input: Record<string, any>,
  client: QueryClient
) => Promise<Record<string, any>>;

export interface SchemaResolvers {
  Query: Record<string, Method>;
  Mutation: Record<string, Method>;
}

export interface ClientPluginConfig {
  import?: Uri[];
  implement?: Uri[];
}

export abstract class Web3ApiPlugin {

  constructor(protected _config: ClientPluginConfig) { }

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

  abstract getSchemaResolvers(client: QueryClient): SchemaResolvers;
}
