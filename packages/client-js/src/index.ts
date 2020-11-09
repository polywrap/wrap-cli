import { resolveURI, Web3APIModuleResolver } from "./lib/resolver";
import { Client, GqlQuery, GqlQueryResult, Web3APIDefinition } from "./lib/types";

export class Web3APIClient implements Client {

  private _cache: Map<string, Web3APIDefinition>;

  constructor(private _resolvers: Web3APIModuleResolver[]) {
    this._cache = new Map<string, Web3APIDefinition>();
  }

  public async query(uri: string, query: GqlQuery): Promise<GqlQueryResult> {
    const apiDefinition = await this.getWeb3APIDefinition(uri);
    const instance = await apiDefinition.create(this);
    return await instance.query(query);
  }

  private async getWeb3APIDefinition(uri: string): Promise<Web3APIDefinition> {
    let definition: Maybe<Web3APIDefinition> = this._cache.get(uri);

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
