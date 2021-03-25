import { getDefaultRedirects } from "./default-redirects";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";
import { WasmWeb3Api } from "./wasm/WasmWeb3Api";

import { v4 as uuid } from "uuid";
import {
  Api,
  ApiCache,
  Client,
  createQueryDocument,
  parseQuery,
  PluginPackage,
  QueryApiOptions,
  QueryApiResult,
  Uri,
  UriRedirect,
  resolveUri,
  InvokeApiOptions,
  InvokeApiResult,
  Manifest,
  sanitizeUriRedirects,
  InvokeContext,
} from "@web3api/core-js";

const DEFAULT_CONTEXT_ID = "default";

export interface ClientConfig<TUri = string> {
  redirects: UriRedirect<TUri>[];
}

export class Web3ApiClient implements Client {
  // TODO: the API cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what APIs,
  // and handle cases where the are multiple jumps. For exmaple, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _apiCache: ApiCache = new Map<string, Api>();
  private _config: ClientConfig<Uri>;

  private _invokeContextMap = new Map<string, InvokeContext>();

  constructor(config?: ClientConfig) {
    if (config) {
      this._config = {
        ...config,
        redirects: sanitizeUriRedirects(config.redirects),
      };
    } else {
      this._config = {
        redirects: [],
      };
    }

    // Add all default redirects (IPFS, ETH, ENS)
    this._config.redirects.push(...getDefaultRedirects());
    this._invokeContextMap.set(DEFAULT_CONTEXT_ID, {
      redirects: this._config.redirects,
    });
  }

  public getInvokeContext(id: string): InvokeContext {
    const context = this._invokeContextMap.get(id);
    if (!context) {
      throw new Error(`No invoke context with found with id: ${id}`);
    }

    return context;
  }

  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>
  >(
    options: QueryApiOptions<TVariables, string>
  ): Promise<QueryApiResult<TData>> {
    let result: QueryApiResult<TData>;
    let queryId: string;

    if (!options.id) {
      queryId = uuid();
    } else {
      queryId = options.id;
    }

    try {
      const { uri, query, variables, redirects } = options;

      let queryRedirects: UriRedirect<Uri>[];
      if (redirects) {
        const queryTimeRedirects = sanitizeUriRedirects(redirects);
        queryTimeRedirects.push(...this._config.redirects);
        queryRedirects = queryTimeRedirects;
      } else {
        queryRedirects = this._config.redirects;
      }

      // Convert the query string into a query document
      const queryDocument =
        typeof query === "string" ? createQueryDocument(query) : query;

      // Parse the query to understand what's being invoked
      const queryInvocations = parseQuery(
        new Uri(uri),
        queryDocument,
        variables
      );

      // Execute all invocations in parallel
      const parallelInvocations: Promise<{
        name: string;
        result: InvokeApiResult<unknown>;
      }>[] = [];

      this._invokeContextMap.set(queryId, {
        redirects: queryRedirects,
      });

      for (const invocationName of Object.keys(queryInvocations)) {
        parallelInvocations.push(
          this.invoke({
            ...queryInvocations[invocationName],
            uri: queryInvocations[invocationName].uri.uri,
            decode: true,
            id: queryId,
          }).then((result) => ({
            name: invocationName,
            result,
          }))
        );
      }

      // Await the invocations
      const invocationResults = await Promise.all(parallelInvocations);

      // Aggregate all invocation results
      const data: Record<string, unknown> = {};
      const errors: Error[] = [];

      for (const invocation of invocationResults) {
        data[invocation.name] = invocation.result.data;
        if (invocation.result.error) {
          errors.push(invocation.result.error);
        }
      }

      result = {
        data: data as TData,
        errors: errors.length === 0 ? undefined : errors,
      };
    } catch (error) {
      if (error.length) {
        result = { errors: error };
      } else {
        result = { errors: [error] };
      }
    }

    if (!options.id) {
      this._invokeContextMap.delete(queryId);
    }

    return result;
  }

  public async invoke<TData = unknown>(
    options: InvokeApiOptions<string>
  ): Promise<InvokeApiResult<TData>> {
    let invokeId: string;
    if (!options.id) {
      invokeId = uuid();

      let redirects: UriRedirect<Uri>[];
      if (options.redirects && options.redirects.length) {
        options.redirects.push(...this._config.redirects);
        redirects = options.redirects;
      } else {
        redirects = this._config.redirects;
      }

      this._invokeContextMap.set(invokeId, {
        redirects: redirects,
      });
    } else {
      invokeId = options.id;
    }

    let result: InvokeApiResult<TData>;
    try {
      const uri = new Uri(options.uri);
      const api = await this.loadWeb3Api(uri, invokeId);
      result = (await api.invoke(
        {
          ...options,
          uri,
        },
        this
      )) as TData;
    } catch (error) {
      result = { error: error };
    }

    if (!options.id) {
      this._invokeContextMap.delete(invokeId);
    }

    return result;
  }

  public async loadWeb3Api(
    uri: Uri,
    invokeContextId = DEFAULT_CONTEXT_ID
  ): Promise<Api> {
    let api: Api | undefined = undefined;
    // avoid using cache if query redirects specified
    api = this._apiCache.get(uri.uri);

    if (!api) {
      api = await resolveUri(
        uri,
        this,
        (uri: Uri, plugin: PluginPackage) => new PluginWeb3Api(uri, plugin),
        (uri: Uri, manifest: Manifest, apiResolver: Uri) =>
          new WasmWeb3Api(uri, manifest, apiResolver),
        invokeContextId
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${uri}`);
      }

      this._apiCache.set(uri.uri, api);
    }

    return api;
  }
}
