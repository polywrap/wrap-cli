import { getDefaultRedirects } from "./default-redirects";

import {
  QueryOptions,
  QueryResult,
  createQueryDocument,
  extractExecuteOptions
} from "./graphql";
import {
  Api,
  ApiCache,
  resolveWeb3Api,
} from "./web3api";
import { Uri, Plugin } from "@web3api/client-lib-js";

export interface ClientConfig {
  redirects: UriRedirect[]
}

export class Web3ApiClient implements Client {

  private _apiCache = new Web3ApiCache();

  constructor(private _config: ClientConfig) {
    const { redirects } = this._config;

    // Add all default redirects (IPFS, ETH, ENS)
    redirects.push(
      ...getDefaultRedirects()
    );
  }

  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>
  >(
    options: QueryOptions<TVariables>
  ): Promise<QueryResult<TData>> {
    try {
      const { uri, query, variables } = args;
      const api = await this.loadWeb3Api(uri);

      // Convert the query string into a query document
      let queryDocument =
        typeof query === "string" ?
        createQueryDocument(query) :
        query;

      // Extract the ExecuteOptions from the query document
      const executeOptions = extractExecuteOptions(
        queryDocument, variables
      );

      // Execute the query
      return await api.execute<TData>(executeOptions, this);
    } catch (error) {
      return { errors: error };
    }
  }

  private async loadWeb3Api(uri: Uri): Promise<Web3Api> {
    let api = this._apiCache.get(uri.uri);

    if (!api) {
      api = await resolveWeb3Api(
        uri, this._config.redirects, this
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${uri}`);
      }

      this._apiCache.set(uri.uri, api);
    }

    return api;
  }
}
