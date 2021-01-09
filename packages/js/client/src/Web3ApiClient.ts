import { getDefaultRedirects } from "./default-redirects";
import { PluginWeb3Api, WasmWeb3Api } from "./web3api";

import {
  Api,
  ApiCache,
  Client,
  createQueryDocument,
  parseQuery,
  Plugin,
  QueryApiOptions,
  QueryApiResult,
  Uri,
  UriRedirect,
  resolveUri,
} from "@web3api/core-js";

export interface ClientConfig {
  redirects: UriRedirect[];
}

export class Web3ApiClient implements Client {
  private _apiCache = new ApiCache();

  constructor(private _config: ClientConfig) {
    const { redirects } = this._config;

    // Add all default redirects (IPFS, ETH, ENS)
    redirects.push(...getDefaultRedirects());
  }

  public redirects(): readonly UriRedirect[] {
    return this._config.redirects;
  }

  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>
  >(options: QueryApiOptions<TVariables>): Promise<QueryApiResult<TData>> {
    try {
      const { uri, query, variables } = options;
      const api = await this.loadWeb3Api(uri);

      // Convert the query string into a query document
      const queryDocument =
        typeof query === "string" ? createQueryDocument(query) : query;

      // Parse the query to understand what's being invoked
      const invokeOptions = parseQuery(queryDocument, variables);

      // TODO: support multiple async queries
      // Process all API invocations
      const result = await api.invoke<TData>(invokeOptions[0], this);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = {} as any;
      data[invokeOptions[0].method] = result.data;

      return {
        data,
        errors: result.errors,
      };
    } catch (error) {
      return { errors: error };
    }
  }

  private async loadWeb3Api(uri: Uri): Promise<Api> {
    let api = this._apiCache.get(uri.uri);

    if (!api) {
      api = await resolveUri(
        uri,
        this,
        (uri: Uri, plugin: () => Plugin) => new PluginWeb3Api(uri, plugin),
        (uri: Uri, manifest: Manifest, apiResolver: Uri) =>
          new WasmWeb3Api(uri, manfest, apiResolver)
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${uri}`);
      }

      this._apiCache.set(uri.uri, api);
    }

    return api;
  }
}
