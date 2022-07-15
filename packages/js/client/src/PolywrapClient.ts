import { v4 as uuid } from "uuid";
import {
  Wrapper,
  WrapperCache,
  Client,
  ClientConfig,
  Env,
  GetEnvsOptions,
  GetFileOptions,
  GetManifestOptions,
  GetImplementationsOptions,
  GetInterfacesOptions,
  GetPluginsOptions,
  GetRedirectsOptions,
  GetSchemaOptions,
  InterfaceImplementations,
  InvokeOptions,
  InvokeResult,
  InvokerOptions,
  PluginRegistration,
  QueryOptions,
  QueryResult,
  SubscribeOptions,
  Subscription,
  Uri,
  UriRedirect,
  createQueryDocument,
  getImplementations,
  parseQuery,
  ResolveUriOptions,
  ResolveUriResult,
  UriResolver,
  GetUriResolversOptions,
  resolveUri,
  CacheResolver,
  ExtendableUriResolver,
  coreInterfaceUris,
  Contextualized,
  ResolveUriErrorType,
  JobRunner,
  RunOptions,
} from "@polywrap/core-js";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Tracer } from "@polywrap/tracing-js";
import { ClientConfigBuilder } from "@polywrap/client-config-js";

export interface PolywrapClientConfig<TUri extends Uri | string = string>
  extends ClientConfig<TUri> {
  tracingEnabled: boolean;
}

export class PolywrapClient implements Client {
  // TODO: the Wrapper cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what Wrappers,
  // and handle cases where the are multiple jumps. For example, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _wrapperCache: WrapperCache = new Map<string, Wrapper>();
  private _config: PolywrapClientConfig<Uri> = {
    redirects: [],
    plugins: [],
    interfaces: [],
    envs: [],
    uriResolvers: [],
    tracingEnabled: false,
  };

  // Invoke specific contexts
  private _contexts: Map<string, PolywrapClientConfig<Uri>> = new Map();

  constructor(
    config?: Partial<PolywrapClientConfig>,
    options?: { noDefaults?: boolean }
  ) {
    try {
      const tracingEnabled = !!config?.tracingEnabled;

      this.setTracingEnabled(tracingEnabled);

      Tracer.startSpan("PolywrapClient: constructor");

      const builder = new ClientConfigBuilder();

      if (config) {
        builder.add(config);
      }

      if (!options?.noDefaults) {
        builder.addDefaults();
      }

      const sanitizedConfig = builder.build();

      this._config = {
        ...sanitizedConfig,
        tracingEnabled: tracingEnabled,
      };

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
      Tracer.enableTracing("PolywrapClient");
    } else {
      Tracer.disableTracing();
    }
  }

  @Tracer.traceMethod("PolywrapClient: getRedirects")
  public getRedirects(
    options: GetRedirectsOptions = {}
  ): readonly UriRedirect<Uri>[] {
    return this._getConfig(options.contextId).redirects;
  }

  @Tracer.traceMethod("PolywrapClient: getPlugins")
  public getPlugins(
    options: GetPluginsOptions = {}
  ): readonly PluginRegistration<Uri>[] {
    return this._getConfig(options.contextId).plugins;
  }

  @Tracer.traceMethod("PolywrapClient: getInterfaces")
  public getInterfaces(
    options: GetInterfacesOptions = {}
  ): readonly InterfaceImplementations<Uri>[] {
    return this._getConfig(options.contextId).interfaces;
  }

  @Tracer.traceMethod("PolywrapClient: getEnvs")
  public getEnvs(options: GetEnvsOptions = {}): readonly Env<Uri>[] {
    return this._getConfig(options.contextId).envs;
  }

  @Tracer.traceMethod("PolywrapClient: getUriResolvers")
  public getUriResolvers(
    options: GetUriResolversOptions = {}
  ): readonly UriResolver[] {
    return this._getConfig(options.contextId).uriResolvers;
  }

  @Tracer.traceMethod("PolywrapClient: getEnvByUri")
  public getEnvByUri<TUri extends Uri | string>(
    uri: TUri,
    options: GetEnvsOptions
  ): Env<Uri> | undefined {
    const uriUri = this._toUri(uri);

    return this.getEnvs(options).find((environment) =>
      Uri.equals(environment.uri, uriUri)
    );
  }

  @Tracer.traceMethod("PolywrapClient: getSchema")
  public async getSchema<TUri extends Uri | string>(
    uri: TUri,
    options: GetSchemaOptions = {}
  ): Promise<string> {
    const wrapper = await this._loadWrapper(this._toUri(uri), options);
    const client = contextualizeClient(this, options.contextId);
    return await wrapper.getSchema(client);
  }

  @Tracer.traceMethod("PolywrapClient: getManifest")
  public async getManifest<TUri extends Uri | string>(
    uri: TUri,
    options: GetManifestOptions
  ): Promise<WrapManifest> {
    const wrapper = await this._loadWrapper(this._toUri(uri), options);
    const client = contextualizeClient(this, options.contextId);
    return await wrapper.getManifest(options, client);
  }

  @Tracer.traceMethod("PolywrapClient: getFile")
  public async getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | Uint8Array> {
    const wrapper = await this._loadWrapper(this._toUri(uri), options);
    const client = contextualizeClient(this, options.contextId);
    return await wrapper.getFile(options, client);
  }

  @Tracer.traceMethod("PolywrapClient: getImplementations")
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

  @Tracer.traceMethod("PolywrapClient: query")
  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(
    options: QueryOptions<TVariables, TUri, PolywrapClientConfig>
  ): Promise<QueryResult<TData>> {
    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    let result: QueryResult<TData>;

    try {
      const typedOptions: QueryOptions<TVariables, Uri> = {
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
        result: InvokeResult<unknown>;
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

  @Tracer.traceMethod("PolywrapClient: invoke")
  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri, PolywrapClientConfig>
  ): Promise<InvokeResult<TData>> {
    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    let error: Error | undefined;

    try {
      const typedOptions: InvokeOptions<Uri> = {
        ...options,
        contextId: contextId,
        uri: this._toUri(options.uri),
      };

      const wrapper = await this._loadWrapper(typedOptions.uri, { contextId });
      const invocableResult = await wrapper.invoke(
        typedOptions,
        contextualizeClient(this, contextId)
      );

      if (invocableResult.data !== undefined) {
        if (options.encodeResult && !invocableResult.encoded) {
          return {
            // TODO: if options.encodeResult, fix return type to Uint8Array
            data: (msgpackEncode(invocableResult.data) as unknown) as TData,
          };
        } else if (invocableResult.encoded && !options.encodeResult) {
          return {
            // TODO: if result.encoded, fix return type to Uint8Array
            data: msgpackDecode(invocableResult.data as Uint8Array) as TData,
          };
        } else {
          return {
            data: invocableResult.data as TData,
          };
        }
      } else {
        error = invocableResult.error;
      }
    } catch (e) {
      error = e;
    }

    if (shouldClearContext) {
      this._clearContext(contextId);
    }

    return { error };
  }

  @Tracer.traceMethod("PolywrapClient: run")
  public async run<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(options: RunOptions<TData, TUri>): Promise<void> {
    const { workflow, onExecution } = options;
    const ids = options.ids ? options.ids : Object.keys(workflow.jobs);
    const jobRunner = new JobRunner<TData, TUri>(this, onExecution);

    await Promise.all(
      ids.map((id) =>
        jobRunner.run({ relativeId: id, parentId: "", jobs: workflow.jobs })
      )
    );
  }

  @Tracer.traceMethod("PolywrapClient: subscribe")
  public subscribe<TData = unknown, TUri extends Uri | string = string>(
    options: SubscribeOptions<TUri, PolywrapClientConfig>
  ): Subscription<TData> {
    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisClient: PolywrapClient = this;
    const client = contextualizeClient(this, contextId);

    const typedOptions: SubscribeOptions<Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };
    const { uri, method, args, config, frequency: freq } = typedOptions;

    // calculate interval between invokes, in milliseconds, 1 min default value
    /* eslint-disable prettier/prettier */
    let frequency: number;
    if (freq && (freq.ms || freq.sec || freq.min || freq.hours)) {
      frequency =
        (freq.ms ?? 0) +
        ((freq.hours ?? 0) * 3600 + (freq.min ?? 0) * 60 + (freq.sec ?? 0)) *
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
      async *[Symbol.asyncIterator](): AsyncGenerator<InvokeResult<TData>> {
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

              const result: InvokeResult<TData> = await client.invoke({
                uri: uri,
                method: method,
                args: args,
                config: config,
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

  @Tracer.traceMethod("PolywrapClient: resolveUri")
  public async resolveUri<TUri extends Uri | string>(
    uri: TUri,
    options?: ResolveUriOptions<ClientConfig>
  ): Promise<ResolveUriResult> {
    options = options || {};

    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    const ignoreCache = this._isContextualized(contextId);
    const cacheWrite = !ignoreCache && !options?.noCacheWrite;
    const cacheRead = !ignoreCache && !options?.noCacheRead;

    const client = contextualizeClient(this, contextId);

    let uriResolvers = this.getUriResolvers({ contextId: contextId });

    if (!cacheRead) {
      uriResolvers = uriResolvers.filter((x) => x.name !== CacheResolver.name);
    }
    const { wrapper, uri: resolvedUri, uriHistory, error } = await resolveUri(
      this._toUri(uri),
      uriResolvers,
      client,
      this._wrapperCache
    );

    // Update cache for all URIs in the chain
    if (cacheWrite && wrapper) {
      for (const item of uriHistory.getResolutionPath().stack) {
        this._wrapperCache.set(item.sourceUri.uri, wrapper);
      }
    }

    if (shouldClearContext) {
      this._clearContext(contextId);
    }

    return {
      wrapper,
      uri: resolvedUri,
      uriHistory,
      error,
    };
  }

  @Tracer.traceMethod("PolywrapClient: loadUriResolverWrappers")
  public async loadUriResolvers(): Promise<{
    success: boolean;
    failedUriResolvers: string[];
  }> {
    const extendableUriResolver = this.getUriResolvers().find(
      (x) => x.name === ExtendableUriResolver.name
    ) as ExtendableUriResolver;

    if (!extendableUriResolver) {
      return {
        success: true,
        failedUriResolvers: [],
      };
    }

    const uriResolverImpls = getImplementations(
      coreInterfaceUris.uriResolver,
      this.getInterfaces(),
      this.getRedirects()
    );

    return extendableUriResolver.loadUriResolverWrappers(
      this,
      this._wrapperCache,
      uriResolverImpls
    );
  }

  @Tracer.traceMethod("PolywrapClient: isContextualized")
  private _isContextualized(contextId: string | undefined): boolean {
    return !!contextId && this._contexts.has(contextId);
  }

  @Tracer.traceMethod("PolywrapClient: getConfig")
  private _getConfig(contextId?: string): Readonly<PolywrapClientConfig<Uri>> {
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

  @Tracer.traceMethod("PolywrapClient: validateConfig")
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

  @Tracer.traceMethod("PolywrapClient: toUri")
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
  @Tracer.traceMethod("PolywrapClient: setContext")
  private _setContext(
    parentId: string | undefined,
    context: Partial<PolywrapClientConfig> | undefined
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

    const parentConfig = this._getConfig(parentId);

    const id = uuid();

    const builder = new ClientConfigBuilder();

    if (context) {
      builder.add(context);
    }

    // Add parent config after context since currently subsequent .add() calls don't override already set values
    builder.add(parentConfig);

    const config = builder.build();

    const newContext = {
      ...config,
      tracingEnabled: context?.tracingEnabled || parentConfig.tracingEnabled,
    };

    this._contexts.set(id, newContext);

    return {
      contextId: id,
      shouldClearContext: true,
    };
  }

  @Tracer.traceMethod("PolywrapClient: clearContext")
  private _clearContext(contextId: string | undefined): void {
    if (contextId) {
      this._contexts.delete(contextId);
    }
  }

  @Tracer.traceMethod("PolywrapClient: _loadWrapper")
  private async _loadWrapper(
    uri: Uri,
    options?: Contextualized
  ): Promise<Wrapper> {
    const { wrapper, uriHistory, error } = await this.resolveUri(uri, {
      contextId: options?.contextId,
    });

    if (!wrapper) {
      if (error) {
        const errorMessage = error.error?.message ?? "";

        switch (error.type) {
          case ResolveUriErrorType.InfiniteLoop:
            throw Error(
              `Infinite loop while resolving URI "${uri}".\nResolution Stack: ${JSON.stringify(
                uriHistory,
                null,
                2
              )}`
            );
            break;
          case ResolveUriErrorType.InternalResolver:
            throw Error(
              `URI resolution error while resolving URI "${uri}".\n${errorMessage}\nResolution Stack: ${JSON.stringify(
                uriHistory,
                null,
                2
              )}`
            );
            break;
          default:
            throw Error(`Unsupported URI resolution error type occurred`);
            break;
        }
      } else {
        throw Error(
          `Unknown URI resolution error while resolving URI "${uri}"\nResolution Stack: ${JSON.stringify(
            uriHistory,
            null,
            2
          )}`
        );
      }
    }

    return wrapper;
  }
}

const contextualizeClient = (
  client: PolywrapClient,
  contextId: string | undefined
): Client =>
  contextId
    ? {
        query: <
          TData extends Record<string, unknown> = Record<string, unknown>,
          TVariables extends Record<string, unknown> = Record<string, unknown>,
          TUri extends Uri | string = string
        >(
          options: QueryOptions<TVariables, TUri>
        ): Promise<QueryResult<TData>> => {
          return client.query({ ...options, contextId });
        },
        invoke: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeOptions<TUri>
        ): Promise<InvokeResult<TData>> => {
          return client.invoke({ ...options, contextId });
        },
        subscribe: <TData = unknown, TUri extends Uri | string = string>(
          options: SubscribeOptions<TUri>
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
        getEnvs: (options: GetEnvsOptions = {}) => {
          return client.getEnvs({ ...options, contextId });
        },
        getUriResolvers: (options: GetUriResolversOptions = {}) => {
          return client.getUriResolvers({ ...options, contextId });
        },
        getEnvByUri: <TUri extends Uri | string>(
          uri: TUri,
          options: GetEnvsOptions = {}
        ) => {
          return client.getEnvByUri(uri, { ...options, contextId });
        },
        getFile: <TUri extends Uri | string>(
          uri: TUri,
          options: GetFileOptions
        ) => {
          return client.getFile(uri, options);
        },
        getSchema: <TUri extends Uri | string>(
          uri: TUri,
          options: GetSchemaOptions = {}
        ) => {
          return client.getSchema(uri, { ...options, contextId });
        },
        getManifest: <TUri extends Uri | string>(
          uri: TUri,
          options: GetManifestOptions
        ) => {
          return client.getManifest(uri, options);
        },
        getImplementations: <TUri extends Uri | string>(
          uri: TUri,
          options: GetImplementationsOptions = {}
        ) => {
          return client.getImplementations(uri, { ...options, contextId });
        },
        resolveUri: <TUri extends Uri | string>(
          uri: TUri,
          options?: ResolveUriOptions<ClientConfig>
        ): Promise<ResolveUriResult> => {
          return client.resolveUri(uri, { ...options, contextId });
        },
        loadUriResolvers: (): Promise<{
          success: boolean;
          failedUriResolvers: string[];
        }> => {
          return client.loadUriResolvers();
        },
        run: <TData extends Record<string, unknown> = Record<string, unknown>>(
          options: RunOptions<TData>
        ): Promise<void> => {
          return client.run({ ...options, contextId });
        },
      }
    : client;
