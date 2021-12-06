import { getDefaultClientConfig } from "./default-client-config";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";
import { WasmWeb3Api } from "./wasm";

import { v4 as uuid } from "uuid";
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
  Subscription,
  SubscribeOptions,
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
  ClientConfig,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export { WasmWeb3Api };

export interface Web3ApiClientConfig<
  TUri extends Uri | string = string
> extends ClientConfig<TUri> {
  tracingEnabled: boolean;
}

export class Web3ApiClient implements Client {
  // TODO: the API cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what APIs,
  // and handle cases where the are multiple jumps. For example, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _apiCache: ApiCache = new Map<string, Api>();
  private _config: Web3ApiClientConfig<Uri> = {
    redirects: [],
    plugins: [],
    interfaces: [],
    tracingEnabled: false,
  };

  // Invoke specific contexts
  private _contexts: Map<string, Web3ApiClientConfig<Uri>> = new Map();

  constructor(config?: Partial<Web3ApiClientConfig>) {
    try {
      this.setTracingEnabled(!!config?.tracingEnabled);

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

      this._validateConfig();

      Tracer.setAttribute("config", this._config);
    } catch (error) {
      Tracer.recordException(error);
      throw error;
    } finally {
      Tracer.endSpan();
    }
  }

  public setTracingEnabled(enable: boolean): void {
    if (enable) {
      Tracer.enableTracing("Web3ApiClient");
    } else {
      Tracer.disableTracing();
    }
    this._config.tracingEnabled = enable;
  }

  public getRedirects(
    contextId?: string
  ): readonly UriRedirect<Uri>[] {
    return this._getConfig(contextId).redirects;
  }

  public getPlugins(
    contextId?: string
  ): readonly PluginRegistration<Uri>[] {
    return this._getConfig(contextId).plugins;
  }

  public getInterfaces(
    contextId?: string
  ): readonly InterfaceImplementations<Uri>[] {
    return this._getConfig(contextId).interfaces;
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

  @Tracer.traceMethod("Web3ApiClient: query")
  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(
    options: QueryApiOptions<TVariables, TUri, Web3ApiClientConfig>
  ): Promise<QueryApiResult<TData>> {

    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    let result: QueryApiResult<TData>;

    const typedOptions: QueryApiOptions<TVariables, Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };

    try {
      const { uri, query, variables } = typedOptions;

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
            contextId
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

      result = {
        data: data as TData,
        errors: errors.length === 0 ? undefined : errors,
      };
    } catch (error: unknown) {
      if (Array.isArray(error)) {
        result = { errors: error };
      } else {
        result = { errors: [error as Error] };
      }
    }

    if (shouldClearContext) {
      this._clearContext(contextId);
    }
    return result;
  }

  @Tracer.traceMethod("Web3ApiClient: invoke")
  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokeApiOptions<TUri, Web3ApiClientConfig>
  ): Promise<InvokeApiResult<TData>> {
    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    const typedOptions: InvokeApiOptions<Uri> = {
      ...options,
      config: undefined,
      contextId: contextId,
      uri: this._toUri(options.uri),
    };

    const api = await this._loadWeb3Api(typedOptions.uri, contextId);

    const result = (await api.invoke(
      typedOptions,
      wrapClient(this, contextId)
    )) as TData;

    if (shouldClearContext) {
      this._clearContext(contextId);
    }
    return result;
  }

  @Tracer.traceMethod("Web3ApiClient: subscribe")
  public subscribe<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(
    options: SubscribeOptions<TVariables, TUri, Web3ApiClientConfig>
  ): Subscription<TData> {

    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    const typedOptions: SubscribeOptions<TVariables, Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };
    const { uri, query, variables, frequency: freq } = typedOptions;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const client: Web3ApiClient = this;

    // calculate interval between queries, in milliseconds, 1 min default value
    /* eslint-disable prettier/prettier */
    let frequency: number;
    if (freq && (freq.ms || freq.sec || freq.min || freq.hours)) {
      frequency =
        (freq.ms ?? 0) +
        ((freq.hours ?? 0) * 3600 +
          (freq.min ?? 0) * 60 +
          (freq.sec ?? 0)) *
          1000;
    } else {
      frequency = 60000;
    }
    /* eslint-enable  prettier/prettier */

    const subscription: Subscription<TData> = {
      frequency: frequency,
      isActive: false,
      stop(): void {
        if (shouldClearContext) {
          client._clearContext(contextId);
        }
        subscription.isActive = false;
      },
      async *[Symbol.asyncIterator](): AsyncGenerator<
        QueryApiResult<TData>
      > {
        let timeout: NodeJS.Timeout | undefined = undefined;
        subscription.isActive = true;

        try {
          let readyVals = 0;
          let sleep: ((value?: unknown) => void) | undefined;

          timeout = setInterval(() => {
            readyVals++;
            if (sleep) {
              sleep();
              sleep = undefined;
            }
          }, frequency);

          while (subscription.isActive) {
            if (readyVals === 0) {
              await new Promise((r) => (sleep = r));
            }

            for (; readyVals > 0; readyVals--) {
              if (!subscription.isActive) {
                break;
              }

              const result: QueryApiResult<TData> = await client.query({
                uri: uri,
                query: query,
                variables: variables,
                contextId,
              });

              yield result;
            }
          }
        } finally {
          if (timeout) {
            clearInterval(timeout);
          }
          if (shouldClearContext) {
            client._clearContext(contextId);
          }
          subscription.isActive = false;
        }
      },
    };

    return subscription;
  }

  @Tracer.traceMethod("Web3ApiClient: _loadWeb3Api")
  private async _loadWeb3Api(uri: Uri, invokeContextId?: string): Promise<Api> {
    const typedUri = typeof uri === "string" ? new Uri(uri) : uri;
    let api = this._apiCache.get(uri.uri);

    if (!api) {
      const config = invokeContextId
        ? this._getConfig(invokeContextId)
        : this._config;
      api = await resolveUri(
        typedUri,
        config.redirects,
        config.plugins,
        config.interfaces,
        <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeApiOptions<TUri>
        ): Promise<InvokeApiResult<TData>> =>
          this.invoke<TData, TUri>(options),
        (uri: Uri, plugin: PluginPackage) => new PluginWeb3Api(uri, plugin),
        (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) =>
          new WasmWeb3Api(uri, manifest, uriResolver)
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${typedUri}`);
      }

      this._apiCache.set(typedUri.uri, api);
    }

    return api;
  }

  @Tracer.traceMethod("Web3ApiClient: getImplementations")
  public getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options?: GetImplementationsOptions
  ): TUri[] {
    const isUriTypeString = typeof uri === "string";
    const applyRedirects = !!options?.applyRedirects;

    return isUriTypeString
      ? (getImplementations(
          this._toUri(uri),
          this.getInterfaces(),
          applyRedirects ? this.getRedirects() : undefined
        ).map((x: Uri) => x.uri) as TUri[])
      : (getImplementations(
          this._toUri(uri),
          this.getInterfaces(),
          applyRedirects ? this.getRedirects() : undefined
        ) as TUri[]);
  }

  private _getConfig(contextId?: string): Readonly<Web3ApiClientConfig<Uri>> {
    if (contextId) {
      const context = this._contexts.get(contextId);
      if (!context) {
        throw new Error(`No invoke context found with id: ${contextId}`);
      }

      return context;
    } else {
      return this._config;
    }
  }

  private _validateConfig(): void {
    // Require plugins to use non-interface URIs
    const pluginUris = this.getPlugins().map((x) => x.uri.uri);
    const interfaceUris = this.getInterfaces().map((x) => x.interface.uri);

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

  /**
   * Sets invoke context based on 3 cases:
   *  1. id && context   -> use existing context
   *  2. !id && context? -> create new parent context
   *  3. id && !context  -> clear context
   */
  private _setContext(
    contextId?: string,
    context?: Partial<Web3ApiClientConfig>
  ): {
    contextId: string;
    shouldClearContext: boolean;
  } {
    if (contextId && !context) {
      return {
        contextId,
        shouldClearContext: false,
      };
    }

    const invokeId = uuid();
    const config = this._getConfig(contextId);

    this._contexts.set(invokeId, {
      redirects: context?.redirects
        ? sanitizeUriRedirects(context.redirects)
        : config.redirects,
      plugins: context?.plugins
        ? sanitizePluginRegistrations(context.plugins)
        : config.plugins,
      interfaces: context?.interfaces
        ? sanitizeInterfaceImplementations(context.interfaces)
        : config.interfaces,
      tracingEnabled: context?.tracingEnabled || config.tracingEnabled,
    });

    return {
      contextId: invokeId,
      shouldClearContext: true,
    };
  }

  private _clearContext(contextId: string): void {
    this._contexts.delete(contextId);
  }
}

const wrapClient = (client: Web3ApiClient, contextId: string): Client => ({
  query: (options: QueryApiOptions<Record<string, unknown>, string | Uri>) =>
    client.query({ ...options, contextId }),
  invoke: (options: InvokeApiOptions<string | Uri>) =>
    client.invoke({ ...options, contextId }),
  subscribe: (
    options: SubscribeOptions<Record<string, unknown>, string | Uri>
  ) => client.subscribe({ ...options, contextId }),
  getRedirects: (
    contextId?: string
  ) => (
    client.getRedirects(contextId)
  ),
  getPlugins: (
    contextId?: string
  ) => (
    client.getPlugins(contextId)
  ),
  getInterfaces: (
    contextId?: string
  ) => (
    client.getInterfaces(contextId)
  ),
  getFile: (uri: string | Uri, options: GetFileOptions) =>
    client.getFile(uri, options),
  getSchema: (uri: string | Uri) => client.getSchema(uri),
  getManifest: <TUri extends string | Uri, TManifestType extends ManifestType>(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ) => client.getManifest(uri, options),
  getImplementations: <TUri extends Uri | string>(
    uri: TUri,
    options?: GetImplementationsOptions
  ) => client.getImplementations(uri, options),
});
