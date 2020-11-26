import {
  QueryDocument,
  QueryResult,
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
  redirects: UriRedirect[],
  env?: () => Record<string, any>
}

export interface QueryOptions {
  uri: string;
  query: string | QueryDocument;
  variables: Record<string, any>
}

export class Web3ApiClient {

  private _apiCache = new Web3ApiCache();

  constructor(private _config: ClientConfig) {
    const { redirects, env } = this._config;

    // Add all core plugins
    redirects.push(
      ...getCorePluginRedirects(
        env || (() => ({ }))
      )
    );
  }

  public async query(options: QueryOptions): Promise<QueryResult> {
    try {
      const { uri, query, variables } = options;
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
        uri, this._config.redirects
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${uri}`);
      }

      this._apiCache.set(uri, api);
    }

    return api;
  }
}
