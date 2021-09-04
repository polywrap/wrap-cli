import { getDefaultClientConfig } from "./default-client-config";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";
import { WasmWeb3Api } from "./wasm";

import {
  Api,
  ApiCache,
  Client,
  InvokeApiOptions,
  InvokeApiResult,
  PluginPackage,
  QueryApiOptions,
  QueryApiResult,
  Uri,
  UriRedirect,
  InterfaceImplementations,
  PluginRegistration,
  Web3ApiManifest,
  parseQuery,
  resolveUri,
  AnyManifest,
  ManifestType,
  GetImplementationsOptions,
  GetManifestOptions,
  GetFileOptions,
  createQueryDocument,
  getImplementations,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  sanitizeUriRedirects,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export { WasmWeb3Api };

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

      // Add the default config
      const defaultClientConfig = getDefaultClientConfig();

      if (defaultClientConfig.redirects) {
        this._config.redirects.push(...defaultClientConfig.redirects);
      }

      if (defaultClientConfig.plugins) {
        this._config.plugins.push(...defaultClientConfig.plugins);
      }

      if (defaultClientConfig.interfaces) {
        this._config.interfaces.push(...defaultClientConfig.interfaces);
      }

      this._requirePluginsToUseNonInterfaceUris();

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
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(
    options: QueryApiOptions<TVariables, TUri>
  ): Promise<QueryApiResult<TData>> {
    let typedOptions: QueryApiOptions<TVariables, Uri>;

    if (typeof options.uri === "string") {
      typedOptions = {
        ...options,
        uri: new Uri(options.uri),
      };
    } else {
      typedOptions = options as QueryApiOptions<TVariables, Uri>;
    }

    const run = Tracer.traceFunc(
      "Web3ApiClient: query",
      async (
        options: QueryApiOptions<TVariables, Uri>
      ): Promise<QueryApiResult<TData>> => {
        const { uri, query, variables } = options;

        // Convert the query string into a query document
        const queryDocument =
          typeof query === "string" ? createQueryDocument(query) : query;

        // Parse the query to understand what's being invoked
        const queryInvocations = parseQuery(uri, queryDocument, variables);

        // Execute all invocations in parallel
        const parallelInvocations: Promise<{
          name: string;
          result: InvokeApiResult<unknown>;
        }>[] = [];

        for (const invocationName of Object.keys(queryInvocations)) {
          parallelInvocations.push(
            this.invoke({
              ...queryInvocations[invocationName],
              uri: queryInvocations[invocationName].uri,
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

    return await run(typedOptions).catch((error) => {
      if (error.length) {
        return { errors: error };
      } else {
        return { errors: [error] };
      }
    });
  }

  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokeApiOptions<TUri>
  ): Promise<InvokeApiResult<TData>> {
    const typedOptions: InvokeApiOptions<Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };

    const run = Tracer.traceFunc(
      "Web3ApiClient: invoke",
      async (
        options: InvokeApiOptions<Uri>
      ): Promise<InvokeApiResult<TData>> => {
        const api = await this._loadWeb3Api(options.uri);

        const result = (await api.invoke(options, this)) as TData;

        return result;
      }
    );

    return run(typedOptions);
  }

  public async getSchema<TUri extends Uri | string>(
    uri: TUri
  ): Promise<string> {
    const api = await this._loadWeb3Api(this._toUri(uri));
    return await api.getSchema(this);
  }

  public async getManifest<
    TUri extends Uri | string,
    TManifestType extends ManifestType
  >(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ): Promise<AnyManifest<TManifestType>> {
    const api = await this._loadWeb3Api(this._toUri(uri));
    return await api.getManifest(options, this);
  }

  public async getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | ArrayBuffer> {
    const api = await this._loadWeb3Api(this._toUri(uri));
    return await api.getFile(options, this);
  }

  public getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options?: GetImplementationsOptions
  ): TUri[] {
    const isUriTypeString = typeof uri === "string";

    const run = Tracer.traceFunc(
      "Web3ApiClient: getImplementations",
      (): TUri[] => {
        const applyRedirects = !!options?.applyRedirects;

        return isUriTypeString
          ? (getImplementations(
              this._toUri(uri),
              this.interfaces(),
              applyRedirects ? this.redirects() : undefined
            ).map((x) => x.uri) as TUri[])
          : (getImplementations(
              this._toUri(uri),
              this.interfaces(),
              applyRedirects ? this.redirects() : undefined
            ) as TUri[]);
      }
    );

    return run();
  }

  private async _loadWeb3Api(uri: Uri): Promise<Api> {
    const typedUri = typeof uri === "string" ? new Uri(uri) : uri;

    const run = Tracer.traceFunc(
      "Web3ApiClient: _loadWeb3Api",
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
            (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) =>
              new WasmWeb3Api(uri, manifest, uriResolver)
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

  private _requirePluginsToUseNonInterfaceUris(): void {
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

  private _toUri(uri: Uri | string): Uri {
    if (typeof uri === "string") {
      return new Uri(uri);
    } else if (Uri.isUri(uri)) {
      return uri;
    } else {
      throw Error(`Unknown uri type, cannot convert. ${JSON.stringify(uri)}`);
    }
  }
}
