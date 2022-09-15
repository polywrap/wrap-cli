import { v4 as uuid } from "uuid";
import {
  Wrapper,
  Client,
  ClientConfig,
  Env,
  GetEnvsOptions,
  GetFileOptions,
  GetImplementationsOptions,
  GetInterfacesOptions,
  GetRedirectsOptions,
  InterfaceImplementations,
  InvokeOptions,
  InvokeResult,
  InvokerOptions,
  QueryOptions,
  QueryResult,
  SubscribeOptions,
  Subscription,
  Uri,
  UriRedirect,
  createQueryDocument,
  getImplementations,
  parseQuery,
  TryResolveUriOptions,
  IUriResolver,
  GetUriResolverOptions,
  Contextualized,
  GetManifestOptions,
  initWrapper,
  IWrapPackage,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionContext,
  getEnvFromUriHistory,
} from "@polywrap/core-js";
import {
  buildCleanUriHistory,
  IWrapperCache,
} from "@polywrap/uri-resolvers-js";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Tracer, TracerConfig, TracingLevel } from "@polywrap/tracing-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Result } from "@polywrap/result";

export interface PolywrapClientConfig<TUri extends Uri | string = string>
  extends ClientConfig<TUri> {
  tracerConfig: Partial<TracerConfig>;
  wrapperCache?: IWrapperCache;
}

export class PolywrapClient implements Client {
  private _config: PolywrapClientConfig<Uri> = ({
    redirects: [],
    interfaces: [],
    envs: [],
    tracerConfig: {},
  } as unknown) as PolywrapClientConfig<Uri>;

  // Invoke specific contexts
  private _contexts: Map<string, PolywrapClientConfig<Uri>> = new Map();

  constructor(
    config?: Partial<PolywrapClientConfig<string | Uri>>,
    options?: { noDefaults?: boolean }
  ) {
    try {
      this.setTracingEnabled(config?.tracerConfig);

      Tracer.startSpan("PolywrapClient: constructor");

      const builder = new ClientConfigBuilder();

      if (!options?.noDefaults) {
        builder.addDefaults(config?.wrapperCache, config?.resolver);
        if (config) {
          // Add everything except for the resolver because we already added it above
          builder.add({
            ...config,
            resolver: undefined,
          });
        }
      } else {
        if (config) {
          builder.add(config);
        }
      }

      const sanitizedConfig = builder.build();

      this._config = {
        ...sanitizedConfig,
        tracerConfig: {
          consoleEnabled: !!config?.tracerConfig?.consoleEnabled,
          consoleDetailed: config?.tracerConfig?.consoleDetailed,
          httpEnabled: !!config?.tracerConfig?.httpEnabled,
          httpUrl: config?.tracerConfig?.httpUrl,
          tracingLevel: config?.tracerConfig?.tracingLevel,
        },
      };

      Tracer.setAttribute("config", this._config);
    } catch (error) {
      Tracer.recordException(error);
      throw error;
    } finally {
      Tracer.endSpan();
    }
  }

  public setTracingEnabled(tracerConfig?: Partial<TracerConfig>): void {
    if (tracerConfig?.consoleEnabled || tracerConfig?.httpEnabled) {
      Tracer.enableTracing("PolywrapClient", tracerConfig);
    } else {
      Tracer.disableTracing();
    }
    this._config.tracerConfig = tracerConfig ?? {};
  }

  @Tracer.traceMethod("PolywrapClient: getRedirects")
  public getRedirects(
    options: GetRedirectsOptions = {}
  ): readonly UriRedirect<Uri>[] {
    return this._getConfig(options.contextId).redirects;
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

  @Tracer.traceMethod("PolywrapClient: getUriResolver")
  public getUriResolver(
    options: GetUriResolverOptions = {}
  ): IUriResolver<unknown> {
    return this._getConfig(options.contextId).resolver;
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

  @Tracer.traceMethod("PolywrapClient: getManifest")
  public async getManifest<TUri extends Uri | string>(
    uri: TUri,
    options: GetManifestOptions = {}
  ): Promise<WrapManifest> {
    const wrapper = await this._loadWrapper(
      this._toUri(uri),
      undefined,
      options
    );
    const client = contextualizeClient(this, options.contextId);
    return await wrapper.getManifest(options, client);
  }

  @Tracer.traceMethod("PolywrapClient: getFile")
  public async getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | Uint8Array> {
    const wrapper = await this._loadWrapper(
      this._toUri(uri),
      undefined,
      options
    );
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

  @Tracer.traceMethod("PolywrapClient: query", TracingLevel.High)
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

  @Tracer.traceMethod("PolywrapClient: invokeWrapper")
  public async invokeWrapper<
    TData = unknown,
    TUri extends Uri | string = string
  >(
    options: InvokerOptions<TUri, PolywrapClientConfig> & { wrapper: Wrapper }
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

      const wrapper = options.wrapper;
      const invocableResult = await wrapper.invoke(
        typedOptions,
        contextualizeClient(this, contextId)
      );

      if (invocableResult.data !== undefined) {
        if (options.encodeResult && !invocableResult.encoded) {
          return {
            data: (msgpackEncode(invocableResult.data) as unknown) as TData,
          };
        } else if (invocableResult.encoded && !options.encodeResult) {
          return {
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

      const resolutionContext =
        options.resolutionContext ?? new UriResolutionContext();

      const wrapper = await this._loadWrapper(
        typedOptions.uri,
        resolutionContext,
        { contextId }
      );

      const client = contextualizeClient(this, contextId);

      const env = getEnvFromUriHistory(
        resolutionContext.getResolutionPath(),
        client
      );

      return await client.invokeWrapper({
        env: env?.env,
        ...typedOptions,
        wrapper,
      });
    } catch (e) {
      error = e;
    }

    if (shouldClearContext) {
      this._clearContext(contextId);
    }

    return { error };
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

  @Tracer.traceMethod("PolywrapClient: tryResolveUri", TracingLevel.High)
  public async tryResolveUri<TUri extends Uri | string>(
    options: TryResolveUriOptions<TUri>
  ): Promise<Result<UriPackageOrWrapper, unknown>> {
    const uri = this._toUri(options.uri);

    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    const client = contextualizeClient(this, contextId);

    const uriResolver = this.getUriResolver({ contextId: contextId });

    const resolutionContext =
      options.resolutionContext ?? new UriResolutionContext();

    const response = await uriResolver.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    if (shouldClearContext) {
      this._clearContext(contextId);
    }

    if (options.resolutionContext) {
      Tracer.setAttribute(
        "label",
        buildCleanUriHistory(options.resolutionContext.getHistory()),
        TracingLevel.High
      );
    }

    return response;
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

    const config = new ClientConfigBuilder()
      .add({
        envs: context.envs ?? parentConfig.envs,
        interfaces: context.interfaces ?? parentConfig.interfaces,
        redirects: context.redirects ?? parentConfig.redirects,
        resolver: context.resolver ?? parentConfig.resolver,
      })
      .build();

    const newContext = {
      ...config,
      tracerConfig: context.tracerConfig ?? parentConfig.tracerConfig,
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

  @Tracer.traceMethod("PolywrapClient: _loadWrapper", TracingLevel.High)
  private async _loadWrapper(
    uri: Uri,
    resolutionContext?: IUriResolutionContext,
    options?: Contextualized
  ): Promise<Wrapper> {
    Tracer.setAttribute("label", `Wrapper loaded: ${uri}`, TracingLevel.High);

    if (!resolutionContext) {
      resolutionContext = new UriResolutionContext();
    }

    const result = await this.tryResolveUri({
      uri,
      resolutionContext,
      contextId: options?.contextId,
    });

    if (!result.ok) {
      if (result.error) {
        throw result.error;
      } else {
        throw Error(
          `Error resolving URI "${uri.uri}"\nResolution Stack: ${JSON.stringify(
            resolutionContext.getHistory(),
            null,
            2
          )}`
        );
      }
    }

    const uriPackageOrWrapper = result.value;

    if (uriPackageOrWrapper.type === "uri") {
      throw Error(
        `Error resolving URI "${uri.uri}"\nURI not found ${
          uriPackageOrWrapper.uri.uri
        }\nResolution Stack: ${JSON.stringify(history, null, 2)}`
      );
    }

    let packageOrWrapper: IWrapPackage | Wrapper;

    if (uriPackageOrWrapper.type === "package") {
      packageOrWrapper = uriPackageOrWrapper.package;
    } else {
      packageOrWrapper = uriPackageOrWrapper.wrapper;
    }

    const wrapper = await initWrapper(packageOrWrapper);

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
        invokeWrapper: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeOptions<TUri> & { wrapper: Wrapper }
        ): Promise<InvokeResult<TData>> => {
          return client.invokeWrapper({ ...options, contextId });
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
        getInterfaces: (options: GetInterfacesOptions = {}) => {
          return client.getInterfaces({ ...options, contextId });
        },
        getEnvs: (options: GetEnvsOptions = {}) => {
          return client.getEnvs({ ...options, contextId });
        },
        getUriResolver: (options: GetUriResolverOptions = {}) => {
          return client.getUriResolver({ ...options, contextId });
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
          return client.getFile(uri, { ...options, contextId });
        },
        getManifest: <TUri extends Uri | string>(
          uri: TUri,
          options: GetManifestOptions = {}
        ) => {
          return client.getManifest(uri, { ...options, contextId });
        },
        getImplementations: <TUri extends Uri | string>(
          uri: TUri,
          options: GetImplementationsOptions = {}
        ) => {
          return client.getImplementations(uri, { ...options, contextId });
        },
        tryResolveUri: <TUri extends Uri | string>(
          options: TryResolveUriOptions<TUri, ClientConfig>
        ): Promise<Result<UriPackageOrWrapper, unknown>> => {
          return client.tryResolveUri({ ...options, contextId });
        },
      }
    : client;
