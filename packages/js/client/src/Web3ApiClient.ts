import { getDefaultClientConfig } from "./default-client-config";

import { v4 as uuid } from "uuid";
import {
  Api,
  ApiCache,
  Client,
  InvokeApiOptions,
  InvokeApiResult,
  QueryApiOptions,
  QueryApiResult,
  Uri,
  UriRedirect,
  InterfaceImplementations,
  PluginRegistration,
  Env,
  Subscription,
  SubscribeOptions,
  parseQuery,
  AnyManifestArtifact,
  ManifestArtifactType,
  GetRedirectsOptions,
  GetPluginsOptions,
  GetInterfacesOptions,
  GetEnvsOptions,
  GetSchemaOptions,
  GetManifestOptions,
  GetFileOptions,
  GetImplementationsOptions,
  createQueryDocument,
  getImplementations,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  sanitizeUriRedirects,
  sanitizeEnvs,
  ClientConfig,
  ResolveUriError,
  UriResolutionHistory,
  resolveUri,
  UriToApiResolver,
  GetResolversOptions,
  CacheResolver,
  Contextualized,
  ResolveUriOptions,
  RUNTIME_VERSION,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export interface Web3ApiClientConfig<TUri extends Uri | string = string>
  extends ClientConfig<TUri> {
  tracingEnabled: boolean;
  rejectUnsupportedWrapperVersions: boolean;
}

type SemverTuple = [
  number,
  number,
  number,
  string | undefined,
  string | undefined
];

export class Web3ApiClient implements Client {
  private static readonly _semverRange = /^(([[(])(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*))*))?(?:\+([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?, ?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*))*))?(?:\+([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?([\])]))|((0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*))*))?(?:\+([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?)$/i;
  private static readonly _runtimeVersionComponents: SemverTuple = (RUNTIME_VERSION.match(
    Web3ApiClient._semverRange
  ) as Array<string | undefined>)
    .slice(15)
    .map((x: string | undefined, i: number) =>
      i < 3 ? Number(x) : x
    ) as SemverTuple;

  // TODO: the API cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what APIs,
  // and handle cases where the are multiple jumps. For example, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _apiCache: ApiCache = new Map<string, Api>();
  private _config: Web3ApiClientConfig<Uri> = {
    redirects: [],
    plugins: [],
    interfaces: [],
    envs: [],
    resolvers: [],
    tracingEnabled: false,
    rejectUnsupportedWrapperVersions: true,
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
          envs: config.envs ? sanitizeEnvs(config.envs) : [],
          plugins: config.plugins
            ? sanitizePluginRegistrations(config.plugins)
            : [],
          interfaces: config.interfaces
            ? sanitizeInterfaceImplementations(config.interfaces)
            : [],
          resolvers: config.resolvers ?? [],
          tracingEnabled: !!config.tracingEnabled,
          rejectUnsupportedWrapperVersions: !!config.rejectUnsupportedWrapperVersions,
        };
      }

      if (!options?.noDefaults) {
        this._addDefaultConfig();
      }

      this._validateConfig();

      this._sanitizeConfig();

      Tracer.setAttribute("config", this._config);

      this._isWrapperVersionSupported = this._isWrapperVersionSupported.bind(
        this
      );
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

  @Tracer.traceMethod("Web3ApiClient: getEnvs")
  public getEnvs(options: GetEnvsOptions = {}): readonly Env<Uri>[] {
    return this._getConfig(options.contextId).envs;
  }

  @Tracer.traceMethod("Web3ApiClient: getResolvers")
  public getResolvers(
    options: GetResolversOptions = {}
  ): readonly UriToApiResolver[] {
    return this._getConfig(options.contextId).resolvers;
  }

  @Tracer.traceMethod("Web3ApiClient: getEnvByUri")
  public getEnvByUri<TUri extends Uri | string>(
    uri: TUri,
    options: GetEnvsOptions
  ): Env<Uri> | undefined {
    const uriUri = this._toUri(uri);

    return this.getEnvs(options).find((environment) =>
      Uri.equals(environment.uri, uriUri)
    );
  }

  @Tracer.traceMethod("Web3ApiClient: getSchema")
  public async getSchema<TUri extends Uri | string>(
    uri: TUri,
    options: GetSchemaOptions = {}
  ): Promise<string> {
    const api = await this._loadWeb3Api(this._toUri(uri), options);
    const client = contextualizeClient(this, options.contextId);
    return await api.getSchema(client);
  }

  @Tracer.traceMethod("Web3ApiClient: getManifest")
  public async getManifest<
    TUri extends Uri | string,
    TManifestArtifactType extends ManifestArtifactType
  >(
    uri: TUri,
    options: GetManifestOptions<TManifestArtifactType>
  ): Promise<AnyManifestArtifact<TManifestArtifactType>> {
    const api = await this._loadWeb3Api(this._toUri(uri), options);
    const client = contextualizeClient(this, options.contextId);
    return await api.getManifest(options, client);
  }

  @Tracer.traceMethod("Web3ApiClient: getFile")
  public async getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | ArrayBuffer> {
    const api = await this._loadWeb3Api(this._toUri(uri), options);
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

      const api = await this._loadWeb3Api(typedOptions.uri, { contextId });

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

  @Tracer.traceMethod("Web3ApiClient: resolveUri")
  public async resolveUri<TUri extends Uri | string>(
    uri: TUri,
    options?: ResolveUriOptions<ClientConfig>
  ): Promise<{
    api?: Api;
    uri?: Uri;
    uriHistory: UriResolutionHistory;
    error?: ResolveUriError;
  }> {
    options = options || {};

    const { contextId, shouldClearContext } = this._setContext(
      options.contextId,
      options.config
    );

    const ignoreCache = this._isContextualized(contextId);
    const cacheWrite = !ignoreCache && !options?.noCacheWrite;
    const cacheRead = !ignoreCache && !options?.noCacheRead;

    const client = contextualizeClient(this, contextId);

    let resolvers = this.getResolvers({ contextId: contextId });

    if (!cacheRead) {
      resolvers = resolvers.filter((x) => x.name !== CacheResolver.name);
    }

    const { api, uri: resolvedUri, uriHistory, error } = await resolveUri(
      this._toUri(uri),
      resolvers,
      client,
      this._apiCache
    );

    // Update cache for all URIs in the chain
    if (cacheWrite && api) {
      for (const item of uriHistory.getResolutionPath().stack) {
        this._apiCache.set(item.sourceUri.uri, api);
      }
    }

    if (shouldClearContext) {
      this._clearContext(contextId);
    }

    return {
      api,
      uri: resolvedUri,
      uriHistory,
      error,
    };
  }

  /**
   * Compare two SemVer quintuples.
   *
   * Follows rule 11 of the SemVer 2.0.0 specification
   * (https://semver.org/spec/v2.0.0.html).
   *
   * @param {SemverTuple} l left-hand comparable
   * @param {SemverTuple} r right-hand comparable
   * @returns {number} negative if `l < r`, positive if `l > r`, otherwise 0.
   * @private
   * @static
   */
  private static _compareSemver(l: SemverTuple, r: SemverTuple): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (let i = 0; i < 3; i++) if (l[i] !== r[i]) return l[i] - r[i];
    if (l[3] == null && r[3] != null) return 1;
    if (l[3] != null && r[3] == null) return -1;

    const lPR = (l[3] as string).split("."),
      rPR = (r[3] as string).split(".");
    for (let i = 0; i < Math.min(lPR.length, rPR.length); i++) {
      const li = lPR[i],
        ri = rPR[i];
      if (li.match(/^\d+$/g)) {
        if (ri.match(/^\d+$/g)) {
          const liNumeric = Number(li),
            riNumeric = Number(ri);
          if (liNumeric !== riNumeric) return liNumeric - riNumeric;
        } else return -1;
      } else {
        if (ri.match(/^\d+$/g)) return 1;
        else if (li !== ri) return li.localeCompare(ri);
      }
    }

    return lPR.length - rPR.length; // it's 0 anyway if they're the same
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

    if (defaultClientConfig.resolvers) {
      this._config.resolvers.push(...defaultClientConfig.resolvers);
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

  @Tracer.traceMethod("Web3ApiClient: sanitizeConfig")
  private _sanitizeConfig(): void {
    this._sanitizeInterfacesAndImplementations();
  }

  // Make sure interface URIs are unique and that all of their implementation URIs are unique
  // If not, then merge them
  @Tracer.traceMethod("Web3ApiClient: sanitizeInterfacesAndImplementations")
  private _sanitizeInterfacesAndImplementations(): void {
    const interfaces = this._config.interfaces;
    // Interface hash map used to keep track of interfaces with same URI
    // A set is used to keep track of unique implementation URIs
    const addedInterfacesHashMap = new Map<string, Set<string>>();

    for (const interfaceImplementations of interfaces) {
      const interfaceUri = interfaceImplementations.interface.uri;

      if (!addedInterfacesHashMap.has(interfaceUri)) {
        // If the interface is not added yet then just add it along with its implementations
        addedInterfacesHashMap.set(
          interfaceUri,
          new Set(interfaceImplementations.implementations.map((x) => x.uri))
        );
      } else {
        const existingInterfaceImplementations = addedInterfacesHashMap.get(
          interfaceUri
        ) as Set<string>;

        // Get implementations to add to existing set of implementations
        const newImplementationUris = interfaceImplementations.implementations.map(
          (x) => x.uri
        );

        // Add new implementations to existing set
        newImplementationUris.forEach(
          existingInterfaceImplementations.add,
          existingInterfaceImplementations
        );
      }
    }

    // Collection of unique interfaces with implementations merged
    const sanitizedInterfaces: InterfaceImplementations<Uri>[] = [];

    // Go through the unique hash map of interfaces and implementations and add them to the sanitized interfaces
    for (const [
      interfaceUri,
      implementationSet,
    ] of addedInterfacesHashMap.entries()) {
      sanitizedInterfaces.push({
        interface: new Uri(interfaceUri),
        implementations: [...implementationSet].map((x) => new Uri(x)),
      });
    }

    this._config.interfaces = sanitizedInterfaces;
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
      envs: context?.envs ? sanitizeEnvs(context.envs) : config.envs,
      resolvers: context?.resolvers ?? config.resolvers,
      tracingEnabled: context?.tracingEnabled || config.tracingEnabled,
      rejectUnsupportedWrapperVersions:
        context?.rejectUnsupportedWrapperVersions ||
        config.rejectUnsupportedWrapperVersions,
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
  private async _loadWeb3Api(uri: Uri, options?: Contextualized): Promise<Api> {
    const { api, uriHistory, error } = await this.resolveUri(uri, {
      contextId: options?.contextId,
    });
    if (!api) {
      if (error && error === ResolveUriError.InfiniteLoop) {
        throw Error(
          `Infinite loop while resolving URI "${uri}".\nResolution Stack: ${JSON.stringify(
            uriHistory,
            null,
            2
          )}`
        );
      }

      throw Error(
        `No Web3API found at URI: ${uri.uri}` +
          `\nResolution history: ${JSON.stringify(uriHistory, null, 2)}`
      );
    }

    const manifest = await api.getManifest(
      { type: "web3api" },
      contextualizeClient(this, options?.contextId)
    );
    if (!this._isWrapperVersionSupported(manifest?.targets)) {
      const errorMessage = `This runtime is not supported by the provided wrapper.
         runtime=${RUNTIME_VERSION}
         targets=${JSON.stringify(manifest?.targets, null, 2)}`;

      if (this._config.rejectUnsupportedWrapperVersions)
        throw new RangeError(
          errorMessage,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uri.toString()
        );
      else console.error(errorMessage, uri.toString());
    }

    return api;
  }

  /**
   * Checks if a given wrapper targets the runtime provided by this client.
   *
   * @param {string | string[] | undefined} v target declaration for a wrapper
   * @returns {boolean} whether the current runtime version is targeted.
   * @private
   */
  @Tracer.traceMethod("Web3ApiClient: _isWrapperVersionSupported")
  private _isWrapperVersionSupported(
    v: string | string[] | undefined
  ): boolean {
    if (v == null) v = "0.0.1-prealpha.69"; // the last version before versioning
    if (Array.isArray(v)) return v.some(this._isWrapperVersionSupported);

    const components = v.match(Web3ApiClient._semverRange);
    if (components == null) return false;

    /*
     * These array deconstructions and number conversions should never fail,
     * in principle, because of the regex. That is, the regex should catch and
     * reject any cases where these values would fail to convert to be
     * separated and converted to numbers correctly. So try/catches shouldn't
     * be necessary in either of the branches here.
     */
    if (components[1] != null) {
      // target was a range
      const [
        lowerBound,
        lbMajor,
        lbMinor,
        lbPatch,
        lbPreRelease,
        lbBuild,
        ubMajor,
        ubMinor,
        ubPatch,
        ubPreRelease,
        ubBuild,
        upperBound,
      ] = components.slice(2, 14);
      const lb: SemverTuple = [
          Number(lbMajor),
          Number(lbMinor),
          Number(lbPatch),
          lbPreRelease,
          lbBuild,
        ],
        ub: SemverTuple = [
          Number(ubMajor),
          Number(ubMinor),
          Number(ubPatch),
          ubPreRelease,
          ubBuild,
        ];

      if (Web3ApiClient._compareSemver(lb, ub) > 0) {
        // check if they're reversed
        const l = Web3ApiClient._compareSemver(
            ub,
            Web3ApiClient._runtimeVersionComponents
          ),
          r = Web3ApiClient._compareSemver(
            Web3ApiClient._runtimeVersionComponents,
            lb
          );
        return (
          (lowerBound === "[" ? r <= 0 : r < 0) &&
          (upperBound === "]" ? l <= 0 : l < 0)
        );
      } else {
        const l = Web3ApiClient._compareSemver(
            lb,
            Web3ApiClient._runtimeVersionComponents
          ),
          r = Web3ApiClient._compareSemver(
            Web3ApiClient._runtimeVersionComponents,
            ub
          );
        return (
          (lowerBound === "[" ? l <= 0 : l < 0) &&
          (upperBound === "]" ? r <= 0 : r < 0)
        );
      }
    } else {
      // target was a single version
      const [major, minor, patch, preRelease, build] = components.slice(15);
      return (
        Web3ApiClient._compareSemver(Web3ApiClient._runtimeVersionComponents, [
          Number(major),
          Number(minor),
          Number(patch),
          preRelease,
          build,
        ]) === 0
      );
    }
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
        getEnvs: (options: GetEnvsOptions = {}) => {
          return client.getEnvs({ ...options, contextId });
        },
        getResolvers: (options: GetResolversOptions = {}) => {
          return client.getResolvers({ ...options, contextId });
        },
        getEnvByUri: <TUri extends Uri | string>(
          uri: TUri,
          options: GetEnvsOptions = {}
        ) => {
          return client.getEnvByUri(uri, { ...options, contextId });
        },
        getSchema: <TUri extends Uri | string>(
          uri: TUri,
          options: GetSchemaOptions = {}
        ) => {
          return client.getSchema(uri, { ...options, contextId });
        },
        getManifest: <
          TUri extends Uri | string,
          TManifestArtifactType extends ManifestArtifactType
        >(
          uri: TUri,
          options: GetManifestOptions<TManifestArtifactType>
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
        resolveUri: <TUri extends Uri | string>(
          uri: TUri,
          options?: ResolveUriOptions<ClientConfig>
        ): Promise<{
          api?: Api;
          uri?: Uri;
          uriHistory: UriResolutionHistory;
          error?: ResolveUriError;
        }> => {
          return client.resolveUri(uri, { ...options, contextId });
        },
      }
    : client;
