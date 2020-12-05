import {
  QueryArgs,
  QueryResult,
  QueryClient,
  createQueryDocument,
  extractExecuteOptions
} from "./graphql";
import {
  Web3Api,
  Web3ApiCache,
  fetchWeb3Api,
  getCorePluginRedirects
} from "./web3api";
import { Web3ApiClientPlugin } from "./plugin";

export interface UriRedirect {
  from: string | RegExp;
  to: string | (() => Web3ApiClientPlugin);
}

export interface ClientConfig {
  redirects: UriRedirect[]
}

export class Web3ApiClient implements QueryClient {

  private _apiCache = new Web3ApiCache();

  constructor(private _config: ClientConfig) {
    const { redirects } = this._config;

    // Add all core plugins
    redirects.push(
      ...getCorePluginRedirects()
    );
  }

  public async query<TData = Record<string, unknown>>(
    args: QueryArgs
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
      return api.execute(executeOptions, this);
    } catch (error) {
      return { error };
    }
  }

  private async loadWeb3Api(uri: string): Promise<Web3Api> {
    let api = this._apiCache.get(uri);

    if (!api) {
      api = await fetchWeb3Api(
        uri, this._config.redirects, this
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${uri}`);
      }

      this._apiCache.set(uri, api);
    }

    return api;
  }
}
