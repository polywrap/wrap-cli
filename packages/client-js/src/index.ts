import { resolveURI } from "./lib/resolver";
import {
  GqlQuery,
  GqlQueryResult,
  Web3APIDefinition
} from "./lib/types";

export interface GqlQueryConfig {
  uri: string;
  query: GqlQuery;
  variables: any; // TODO: types
}

export interface Web3APIClientConfig {
  plugins: Plugin[];
}

export class Web3APIClient implements Client {

  private _cache: Map<string, Web3APIDefinition>;

  constructor(private _config: Web3APIClientConfig) {
    this._cache = new Map<string, Web3APIDefinition>();
  }

  public async query(options: {
    uri: string,
    query: GqlQuery,
    variables: any
  }): Promise<GqlQueryResult> {
    const apiDefinition = await this.getWeb3APIDefinition(uri);
    const instance = await apiDefinition.create(this);

    // TODO:
    // - TODO: See if an extension is being used (subgraph), if so send that way
    // - Only accept ExecutableDefinitionNode -> OperationDefinitionNode
    // - No FragmentDefinitionNodes
    // - Extract all variables & argument values -> args
    // - Extract the method name
    // - Extract the type you're querying (Query, Mutation)
    return await instance.query(query);
  }

  private async getWeb3APIDefinition(uri: string): Promise<Web3APIDefinition> {
    let definition = this._cache.get(uri);

    if (!definition) {
      definition = await resolveURI(uri, this._resolvers);
      if (!definition) {
        throw new Error(`Unable to resolve ${uri} into a Web3API`);
      }

      this._cache.set(uri, definition);
    }

    return definition;
  }
}
