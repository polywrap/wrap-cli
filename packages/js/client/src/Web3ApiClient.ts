import { getDefaultRedirects } from "./default-redirects";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";
import { WasmWeb3Api } from "./wasm/WasmWeb3Api";

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
} from "@web3api/core-js";

export interface ClientConfig {
  redirects: UriRedirect[];
}

export class Web3ApiClient implements Client {
  // TODO: the API cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what APIs,
  // and handle cases where the are multiple jumps. For exmaple, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _apiCache: ApiCache = new Map<string, Api>();

  constructor(
    private _config: ClientConfig = {
      redirects: [],
    }
  ) {
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

      // Convert the query string into a query document
      const queryDocument =
        typeof query === "string" ? createQueryDocument(query) : query;

      // Parse the query to understand what's being invoked
      const invokeOptions = parseQuery(uri, queryDocument, variables);

      // Execute all invocations in parallel
      const parallelInvocations: Promise<{
        method: string;
        result: InvokeApiResult<unknown>;
      }>[] = [];

      for (const invocation of invokeOptions) {
        parallelInvocations.push(
          this.invoke({
            ...invocation,
            decode: true,
          }).then((result) => ({
            method: invocation.method,
            result,
          }))
        );
      }

      // Await the invocations
      const invocations = await Promise.all(parallelInvocations);

      // Aggregate all invocation results
      let methods: string[] = [];
      const resultDatas: unknown[] = [];
      const errors: Error[] = [];

      for (const invocation of invocations) {
        methods.push(invocation.method);
        resultDatas.push(invocation.result.data);
        if (invocation.result.error) {
          errors.push(invocation.result.error);
        }
      }

      // Helper for appending "_#" to repeated names
      const makeRepeatedUnique = (names: string[]): string[] => {
        const counts: { [key: string]: number } = {};

        return names.reduce((acc, name) => {
          const count = (counts[name] = (counts[name] || 0) + 1);
          const uniq = count > 1 ? `${name}_${count - 1}` : name;
          acc.push(uniq);
          return acc;
        }, [] as string[]);
      };

      methods = makeRepeatedUnique(methods);

      // Build are data map, where each method maps to its data
      const data: Record<string, unknown> = {};

      for (let i = 0; i < methods.length; ++i) {
        data[methods[i]] = resultDatas[i];
      }

      return {
        data: data as TData,
        errors: errors.length === 0 ? undefined : errors,
      };
    } catch (error) {
      if (error.length) {
        return { errors: error };
      } else {
        return { errors: [error] };
      }
    }
  }

  public async invoke<TData = unknown>(
    options: InvokeApiOptions
  ): Promise<InvokeApiResult<TData>> {
    try {
      const { uri } = options;
      const api = await this.loadWeb3Api(uri);
      return (await api.invoke(options, this)) as TData;
    } catch (error) {
      return { error: error };
    }
  }

  public async loadWeb3Api(uri: Uri): Promise<Api> {
    let api = this._apiCache.get(uri.uri);

    if (!api) {
      api = await resolveUri(
        uri,
        this,
        (uri: Uri, plugin: PluginPackage) => new PluginWeb3Api(uri, plugin),
        (uri: Uri, manifest: Manifest, apiResolver: Uri) =>
          new WasmWeb3Api(uri, manifest, apiResolver)
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${uri}`);
      }

      this._apiCache.set(uri.uri, api);
    }

    return api;
  }
}
