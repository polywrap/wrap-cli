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
  sanitizeUriRedirects,
  sanitizeEnvironments,
  Environment,
  Subscription,
  SubscribeOptions,
  parseQuery,
  resolveUri,
  AnyManifest,
  ManifestType,
  GetRedirectsOptions,
  GetPluginsOptions,
  GetInterfacesOptions,
  GetEnvironmentsOptions,
  GetSchemaOptions,
  GetManifestOptions,
  GetFileOptions,
  GetImplementationsOptions,
  createQueryDocument,
  getImplementations,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  ClientConfig,
  InvokableModules,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export interface Web3ApiClientConfig<TUri extends Uri | string = string>
  extends ClientConfig<TUri> {
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
    environments: [],
    tracingEnabled: false,
  };

  // Invoke specific contexts
  private _contexts: Map<string, Web3ApiClientConfig<Uri>> = new Map();

  constructor(
    config?: Partial<Web3ApiClientConfig>,
    options?: { noDefaults?: boolean }
  ) {
    try {
      this.setTracingEnabled(!!config?.tracingEnabled);

      Tracer.startSpan("Web3ApiClient: constructor");

      if (config) {
        this._config = {
          redirects: config.redirects
            ? sanitizeUriRedirects(config.redirects)
            : [],
          environments: config.environments
            ? sanitizeEnvironments(config.environments)
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

      if (!options?.noDefaults) {
        this._addDefaultConfig();
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

  @Tracer.traceMethod("Web3ApiClient: getEnvironmentByUri")
  public getEnvironmentByUri<TUri extends Uri | string>(
    uri: TUri,
    options: GetEnvironmentsOptions
  ): Environment<TUri> | undefined {
    return this.getEnvironments(options).find(
      (environment) => environment.uri.uri === this._toUri(uri).uri
    ) as Environment<TUri> | undefined;
  }

  @Tracer.traceMethod("Web3ApiClient: getRedirects")
  public getRedirects(
    options: GetRedirectsOptions = {}
  ): readonly UriRedirect<Uri>[] {
    return this._getConfig(options.contextId).redirects;
  }

  @Tracer.traceMethod("Web3ApiClient: getPlugins")
  public getPlugins(
    options: GetPluginsOptions = {}
  ): readonly PluginRegistration<Uri>[] {
    return this._getConfig(options.contextId).plugins;
  }

  @Tracer.traceMethod("Web3ApiClient: getInterfaces")
  public getInterfaces(
    options: GetInterfacesOptions = {}
  ): readonly InterfaceImplementations<Uri>[] {
    return this._getConfig(options.contextId).interfaces;
  }

  @Tracer.traceMethod("Web3ApiClient: getEnvironments")
  public getEnvironments(
    options: GetEnvironmentsOptions = {}
  ): readonly Environment<Uri>[] {
    return this._getConfig(options.contextId).environments;
  }

  @Tracer.traceMethod("Web3ApiClient: getSchema")
  public async getSchema<TUri extends Uri | string>(
    uri: TUri,
    options: GetSchemaOptions = {}
  ): Promise<string> {
    const api = await this._loadWeb3Api(this._toUri(uri), options.contextId);
    const client = contextualizeClient(this, options.contextId);
    return await api.getSchema(client);
  }

  @Tracer.traceMethod("Web3ApiClient: getManifest")
  public async getManifest<
    TUri extends Uri | string,
    TManifestType extends ManifestType
  >(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ): Promise<AnyManifest<TManifestType>> {
    const api = await this._loadWeb3Api(this._toUri(uri), options.contextId);
    const client = contextualizeClient(this, options.contextId);
    return await api.getManifest(options, client);
  }

  @Tracer.traceMethod("Web3ApiClient: getFile")
  public async getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | ArrayBuffer> {
    const api = await this._loadWeb3Api(this._toUri(uri), options.contextId);
    const client = contextualizeClient(this, options.contextId);
    return await api.getFile(options, client);
  }

  @Tracer.traceMethod("Web3ApiClient: getImplementations")
  public getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions = {}
  ): TUri[] {
    const isUriTypeString = typeof uri === "string";
    const applyRedirects = !!options.applyRedirects;

    return isUriTypeString
      ? (getImplementations(
          this._toUri(uri),
          this.getInterfaces(options),
          applyRedirects ? this.getRedirects(options) : undefined
        ).map((x: Uri) => x.uri) as TUri[])
      : (getImplementations(
          this._toUri(uri),
          this.getInterfaces(options),
          applyRedirects ? this.getRedirects(options) : undefined
        ) as TUri[]);
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

    try {
      const typedOptions: QueryApiOptions<TVariables, Uri> = {
        ...options,
        uri: this._toUri(options.uri),
      };

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
            contextId,
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

    let result: InvokeApiResult<TData>;

    try {
      const typedOptions: InvokeApiOptions<Uri> = {
        ...options,
        contextId: contextId,
        uri: this._toUri(options.uri),
      };

      const api = await this._loadWeb3Api(
        typedOptions.uri,
        contextId,
        typedOptions.module
      );

      result = (await api.invoke(
        typedOptions,
        contextualizeClient(this, contextId)
      )) as TData;
    } catch (error) {
      result = { error };
    }

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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisClient: Web3ApiClient = this;
    const client = contextualizeClient(this, contextId);

    const typedOptions: SubscribeOptions<TVariables, Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };
    const { uri, query, variables, frequency: freq } = typedOptions;

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
          thisClient._clearContext(contextId);
        }
        subscription.isActive = false;
      },
      async *[Symbol.asyncIterator](): AsyncGenerator<QueryApiResult<TData>> {
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
            thisClient._clearContext(contextId);
          }
          subscription.isActive = false;
        }
      },
    };

    return subscription;
  }

  private _addDefaultConfig() {
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
  }

  @Tracer.traceMethod("Web3ApiClient: isContextualized")
  private _isContextualized(contextId: string | undefined): boolean {
    return !!contextId && this._contexts.has(contextId);
  }

  @Tracer.traceMethod("Web3ApiClient: getConfig")
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

  @Tracer.traceMethod("Web3ApiClient: validateConfig")
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

  @Tracer.traceMethod("Web3ApiClient: toUri")
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
   * Sets invoke context:
   *  1. !parentId && !context  -> do nothing
   *  2. parentId && !context   -> do nothing, use parent context ID
   *  3. !parentId && context   -> create context ID, default config as "base", cache context
   *  4. parentId && context    -> create context ID, parent config as "base", cache context
   */
  @Tracer.traceMethod("Web3ApiClient: setContext")
  private _setContext(
    parentId: string | undefined,
    context: Partial<Web3ApiClientConfig> | undefined
  ): {
    contextId: string | undefined;
    shouldClearContext: boolean;
  } {
    if (!context) {
      return {
        contextId: parentId,
        shouldClearContext: false,
      };
    }

    const config = this._getConfig(parentId);
    const id = uuid();

    this._contexts.set(id, {
      redirects: context?.redirects
        ? sanitizeUriRedirects(context.redirects)
        : config.redirects,
      plugins: context?.plugins
        ? sanitizePluginRegistrations(context.plugins)
        : config.plugins,
      interfaces: context?.interfaces
        ? sanitizeInterfaceImplementations(context.interfaces)
        : config.interfaces,
      environments: context?.environments
        ? sanitizeEnvironments(context.environments)
        : config.environments,
      tracingEnabled: context?.tracingEnabled || config.tracingEnabled,
    });

    return {
      contextId: id,
      shouldClearContext: true,
    };
  }

  @Tracer.traceMethod("Web3ApiClient: clearContext")
  private _clearContext(contextId: string | undefined): void {
    if (contextId) {
      this._contexts.delete(contextId);
    }
  }

  @Tracer.traceMethod("Web3ApiClient: _loadWeb3Api")
  private async _loadWeb3Api(
    uri: Uri,
    contextId: string | undefined,
    module?: string
  ): Promise<Api> {
    const typedUri = typeof uri === "string" ? new Uri(uri) : uri;
    const ignoreCache = this._isContextualized(contextId);
    let api = ignoreCache ? undefined : this._apiCache.get(uri.uri);

    if (!api) {
      const client = contextualizeClient(this, contextId);
      const config = this._getConfig(contextId);
      const environment = this.getEnvironmentByUri(typedUri, { contextId });
      api = await resolveUri(
        typedUri,
        config.redirects,
        config.plugins,
        config.interfaces,
        <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeApiOptions<TUri>
        ): Promise<InvokeApiResult<TData>> =>
          client.invoke<TData, TUri>(options),
        (uri: Uri, plugin: PluginPackage) => new PluginWeb3Api(uri, plugin),
        (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) =>
          new WasmWeb3Api(
            uri,
            manifest,
            uriResolver,
            module as InvokableModules,
            environment
          )
      );

      if (!api) {
        throw Error(`Unable to resolve Web3API at uri: ${typedUri}`);
      }

      if (!ignoreCache) {
        this._apiCache.set(typedUri.uri, api);
      }
    }

    return api;
  }
}

const contextualizeClient = (
  client: Web3ApiClient,
  contextId: string | undefined
): Client =>
  contextId
    ? {
        query: <
          TData extends Record<string, unknown> = Record<string, unknown>,
          TVariables extends Record<string, unknown> = Record<string, unknown>,
          TUri extends Uri | string = string
        >(
          options: QueryApiOptions<TVariables, TUri>
        ): Promise<QueryApiResult<TData>> => {
          return client.query({ ...options, contextId });
        },
        invoke: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeApiOptions<TUri>
        ): Promise<InvokeApiResult<TData>> => {
          return client.invoke({ ...options, contextId });
        },
        subscribe: <
          TData extends Record<string, unknown> = Record<string, unknown>,
          TVariables extends Record<string, unknown> = Record<string, unknown>,
          TUri extends Uri | string = string
        >(
          options: SubscribeOptions<TVariables, TUri>
        ): Subscription<TData> => {
          return client.subscribe({ ...options, contextId });
        },
        getRedirects: (options: GetRedirectsOptions = {}) => {
          return client.getRedirects({ ...options, contextId });
        },
        getPlugins: (options: GetPluginsOptions = {}) => {
          return client.getPlugins({ ...options, contextId });
        },
        getInterfaces: (options: GetInterfacesOptions = {}) => {
          return client.getInterfaces({ ...options, contextId });
        },
        getEnvironments: (options: GetEnvironmentsOptions = {}) => {
          return client.getEnvironments({ ...options, contextId });
        },
        getSchema: <TUri extends Uri | string>(
          uri: TUri,
          options: GetSchemaOptions = {}
        ) => {
          return client.getSchema(uri, { ...options, contextId });
        },
        getManifest: <
          TUri extends Uri | string,
          TManifestType extends ManifestType
        >(
          uri: TUri,
          options: GetManifestOptions<TManifestType>
        ) => {
          return client.getManifest(uri, { ...options, contextId });
        },
        getFile: <TUri extends Uri | string>(
          uri: TUri,
          options: GetFileOptions
        ) => {
          return client.getFile(uri, options);
        },
        getImplementations: <TUri extends Uri | string>(
          uri: TUri,
          options: GetImplementationsOptions = {}
        ) => {
          return client.getImplementations(uri, { ...options, contextId });
        },
        getEnvironmentByUri: <TUri extends Uri | string>(
          uri: TUri,
          options: GetEnvironmentsOptions = {}
        ) => {
          return client.getEnvironmentByUri(uri, { ...options, contextId });
        },
      }
    : client;
