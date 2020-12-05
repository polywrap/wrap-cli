import { QueryClient } from "./graphql";

export type Method = (
  input: Record<string, any>,
  client: QueryClient
) => Promise<Record<string, any>>;

export interface SchemaResolvers {
  Query: Record<string, Method>;
  Mutation: Record<string, Method>;
}

export interface ClientPluginConfig {
  import?: string[];
  implement?: string[];
}

export abstract class Web3ApiClientPlugin {

  constructor(protected _config: ClientPluginConfig) { }

  public isImplemented(uri: string): boolean {
    return this._config.implement !== undefined &&
           this._config.implement.indexOf(uri) > -1;
  }

  public implements(): string[] {
    return this._config.implement || [];
  }

  public imports(): string[] {
    return this._config.import || [];
  }

  abstract getSchemaResolvers(client: QueryClient): SchemaResolvers;
}
