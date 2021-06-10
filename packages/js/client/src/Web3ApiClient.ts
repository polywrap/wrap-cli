import { getDefaultPlugins } from "./get-default-plugins";
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
  InterfaceImplementations,
  PluginRegistration,
  resolveUri,
  InvokeApiOptions,
  InvokeApiResult,
  Manifest,
  sanitizeUriRedirects,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  getImplementations,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export interface ClientConfig<TUri = string> {
  redirects?: UriRedirect<TUri>[];
  plugins?: PluginRegistration<TUri>[];
  interfaces?: InterfaceImplementations<TUri>[];
  tracingEnabled?: boolean;
}

export class Web3ApiClient implements Client {
  // TODO: the API cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what APIs,
  // and handle cases where the are multiple jumps. For exmaple, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _apiCache: ApiCache = new Map<string, Api>();
  private _config: Required<ClientConfig<Uri>> = {
    redirects: [],
    plugins: [],
    interfaces: [],
    tracingEnabled: false,
  };

  constructor(config?: ClientConfig) {
    try {
      this.tracingEnabled(!!config?.tracingEnabled);

      Tracer.startSpan("Web3ApiClient: constructor");

      if (config) {
        this._config = {
          redirects: config.redirects
            ? sanitizeUriRedirects(config.redirects)
            : [],
          plugins: config.plugins
            ? sanitizePluginRegistrations(config.plugins)
            : [],
          interfaces: config.interfaces
            ? sanitizeInterfaceImplementations(config.interfaces)
            : [],
          tracingEnabled: !!config.tracingEnabled,
        };
      }

      // Add all default plugins
      this._config.plugins.push(...getDefaultPlugins());

      this.requirePluginsToUseNonInterfaceUris();

      Tracer.setAttribute("config", this._config);
    } catch (error) {
      Tracer.recordException(error);
      throw error;
    } finally {
      Tracer.endSpan();
    }
  }

  public tracingEnabled(enable: boolean): void {
    if (enable) {
      Tracer.enableTracing("Web3ApiClient");
    } else {
      Tracer.disableTracing();
    }

    this._config.tracingEnabled = enable;
  }

  public redirects(): readonly UriRedirect<Uri>[] {
    return this._config.redirects || [];
  }

  public plugins(): readonly PluginRegistration<Uri>[] {
    return this._config.plugins || [];
  }

  public interfaces(): readonly InterfaceImplementations<Uri>[] {
    return this._config.interfaces || [];
  }

  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>
  >(
    options: QueryApiOptions<TVariables, string>
  ): Promise<QueryApiResult<TData>> {
    const run = Tracer.traceFunc(
      "Web3ApiClient: query",
      async (
        options: QueryApiOptions<TVariables, string>
      ): Promise<QueryApiResult<TData>> => {
        const { uri, query, variables } = options;

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

        for (const invocationName of Object.keys(queryInvocations)) {
          parallelInvocations.push(
            this.invoke({
              ...queryInvocations[invocationName],
              uri: queryInvocations[invocationName].uri.uri,
              decode: true,
            }).then((result) => ({
              name: invocationName,
              result,
            }))
          );
        }

        // Await the invocations
        const invocationResults = await Promise.all(parallelInvocations);

        Tracer.addEvent("invocationResults", invocationResults);

        // Aggregate all invocation results
        const data: Record<string, unknown> = {};
        const errors: Error[] = [];

        for (const invocation of invocationResults) {
          data[invocation.name] = invocation.result.data;
          if (invocation.result.error) {
            errors.push(invocation.result.error);
          }
        }

        return {
          data: data as TData,
          errors: errors.length === 0 ? undefined : errors,
        };
      }
    );

    return await run(options).catch((error) => {
      if (error.length) {
        return { errors: error };
      } else {
        return { errors: [error] };
      }
    });
  }

  public async invoke<TData = unknown>(
    options: InvokeApiOptions<string>
  ): Promise<InvokeApiResult<TData>> {
    const run = Tracer.traceFunc(
      "Web3ApiClient: invoke",
      async (
        options: InvokeApiOptions<string>
      ): Promise<InvokeApiResult<TData>> => {
        const uri = new Uri(options.uri);
        const api = await this.loadWeb3Api(uri);

        const result = (await api.invoke(
          {
            ...options,
            uri,
          },
          this
        )) as TData;

        return result;
      }
    );

    return run(options);
  }

  public async loadWeb3Api(uri: string): Promise<Api>
  public async loadWeb3Api(uri: Uri): Promise<Api> 
  public async loadWeb3Api(uri: string | Uri): Promise<Api> {
    const typedUri = typeof uri === "string"
      ? new Uri(uri)
      : uri;

    const run = Tracer.traceFunc(
      "Web3ApiClient: loadWeb3Api",
      async (uri: Uri): Promise<Api> => {
        let api = this._apiCache.get(uri.uri);

        if (!api) {
          api = await resolveUri(
            uri,
            this,
            this.redirects(),
            this.plugins(),
            this.interfaces(),
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
    );

    return run(typedUri);
  }

  public getImplementations(uri: string): string[]
  public getImplementations(uri: Uri): Uri[]
  public getImplementations(uri: string | Uri, filters: { applyRedirects: boolean } = { applyRedirects: false }): (string | Uri)[] {
    const isUriTypeString = typeof uri === "string"
  
    const typedUri: Uri = isUriTypeString
      ? new Uri(uri as string)
      : uri as Uri;

    const getImplementationsWithoutRedirects = Tracer.traceFunc(
      "Web3ApiClient: getImplementations - getImplementationsWithoutRedirects",
      (uri: Uri): (string | Uri)[] => {
        const interfaceImplementations = this.interfaces().find((x) =>
          Uri.equals(x.interface, uri)
        );

        if (!interfaceImplementations) {
          throw Error(`Interface: ${uri} has no implementations registered`);
        }

        return isUriTypeString
          ? interfaceImplementations.implementations.map((x) => x.uri)
          : interfaceImplementations.implementations
      }
    );

    const getImplementationsWithRedirects = Tracer.traceFunc(
      "Web3ApiClient: getImplementations - getImplementationsWithRedirects",
      (uri: Uri): (string | Uri)[] => {
        return isUriTypeString
          ? getImplementations(
              uri,
              this.redirects(),
              this.plugins(),
              this.interfaces()
            ).map((x) => x.uri)
          : getImplementations(
              uri,
              this.redirects(),
              this.plugins(),
              this.interfaces()
            );
      }
    );

    return filters.applyRedirects
      ? getImplementationsWithRedirects(typedUri)
      : getImplementationsWithoutRedirects(typedUri);
  }

  private requirePluginsToUseNonInterfaceUris(): void {
    const pluginUris = this.plugins().map((x) => x.uri.uri);
    const interfaceUris = this.interfaces().map((x) => x.interface.uri);

    const pluginsWithInterfaceUris = pluginUris.filter((plugin) =>
      interfaceUris.includes(plugin)
    );

    if (pluginsWithInterfaceUris.length) {
      throw Error(
        `Plugins can't use interfaces for their URI. Invalid plugins: ${pluginsWithInterfaceUris}`
      );
    }
  }
}
