from __future__ import annotations


class Web3ApiClient(Client):
    """
    TODO: the API cache needs to be more like a routing table.
    It should help us keep track of what URI's map to what APIs,
    and handle cases where the are multiple jumps. For example, if
    A => B => C, then the cache should have A => C, and B => C.
    """
    def __init__(self, config=None, options=None):
        self._api_cache = {}
        self._config = Web3ApiClientConfig(
            [], [], [], [], []
        )
        # Invoke specific contexts
        self._contexts = {}
        try:
            if config:
                self._config = Web3ApiClientConfig(
                    sanitize_uri_redirects(config.redirects) if config.redirects else [],
                    sanitize_envs(config.envs) if config.envs else [],
                    sanitize_plugin_registrations(config.plugins) if config.plugins else [],
                    sanitize_interface_implementations(config.interfaces) if config.interfaces else [],
                    config.uri_resolvers if config.uri_resolvers else []
                )

                if options and not options.no_defaults:
                    self._add_default_config()

                self._validate_config()
                self.sanitize_config()
        except Exception:
            raise

    @classmethod
    def get_redirects(cls, options: GetRedirectsOptions) -> List[UriRedirect]:
        return cls._get_config(options.context_id).redirects
    
    @classmethod
    def get_plugins(cls, options: GetPluginsOptions) -> List[PluginRegistration]:
        return cls._get_config(options.context_id).plugins
    
    @classmethod
    def get_interfaces(cls, options: GetInterfacesOptions) -> List[InterfaceImplementations]:
        return cls._get_config(options.context_id).interfaces
    
    @classmethod
    def get_envs(cls, options: GetEnvsOptions) -> List[Env]:
        return cls._get_config(options.context_id).envs
    
    @classmethod
    def get_env_by_uri(cls, uri: Union[Uri, str], options: GetEnvsOptions) -> Union[Env, None]:
        def find_uri(environment, uri_uri):
            return Uri.equals(environment.uri, uri_uri)
        
        uri_uri = cls._to_uri(uri)

        return cls.get_envs(options).find(find_uri)
    
    @classmethod
    def get_uri_resolvers(cls, options: GetUriResolversOptions) -> List[UriResolver]:
        return cls._get_config(options.context_id).uri_resolvers
    
    @classmethod
    async def get_schema(cls, uri: Union[Uri, str], options: GetSchemaOptions) -> Awaitable[str]:
        api = await cls._load_web3_api(cls._to_uri(uri), options)
        client = contextualize_client(cls, options.context_id)
        return await api.get_schema(client)
    
    @classmethod
    async def get_manifest(cls, uri: Union[Uri, str], options: GetManifestOptions) -> Awaitable[ManifestArtifactType]:
        api = await cls._load_web3_api(cls._to_uri(uri), options)
        client = contextualize_client(cls, options.context_id)
        return await api.get_manifest(options, client)
    
    @classmethod
    async def get_file(cls, uri: Union[Uri, str], options: GetFileOptions) -> Awaitable[Union[Uri, str]]:
        api = await cls._load_web3_api(cls._to_uri(uri), options)
        client = contextualize_client(cls, options.context_id)
        return await api.get_file(options, client)
    
    @classmethod
    def get_implementations(cls, uri: Union[Uri, str], options: GetImplementationsOptions) -> List[Union[Uri, str]]:
        is_uri_type_string = isinstance(uri, str)
        apply_redirects = options.apply_redirects
        
        return [x.uri for x in get_implementations(
            cls._to_uri(uri),
            cls.get_interfaces(options),
            cls.get_redirects(options) if apply_redirects else None
            )] if is_uri_type_string else get_implementations(
                cls._to_uri(uri),
                cls.get_interfaces(options),
                cls.get_redirects(options) if apply_redirects else None
            )
    
    @classmethod
    async def resolve_uri(cls, uri: Union[Uri, str], options: Optional[ResolveUriOptions]=None) -> Awaitable[ResolveUriResult]:
        options = options or ResolveUriOptions()
        context_id, should_clear_context = cls._sest_context(
            options.context_id,
            options.config
        )

        ignore_cache = cls._is_contextualized(context_id)
        cache_write = not ignore_cache and options and not options.no_cache_write
        cache_read = not ignore_cache and options and not options.no_cache_read

        client = contextualize_client(cls, context_id)

        uri_resolvers = cls.get_uri_resolvers({ context_id: context_id })

        if not cache_read:
            uri_resolvers = [x for x in uri_resolvers if x.name != CacheResolver.name]

        api, uri, uri_history = await resolve_uri(
            cls._to_uri(uri),
            uri_resolvers,
            client,
            cls._api_cache
        )

        # Update cache for all URIs in the chain
        if cache_write and api:
            for item in uri_history.get_resolution_path().stack:
                cls._api_cache.set(item.source_uri.uri, api)

        if should_clear_context:
            cls._clear_context(context_id)
        
        return ResolveUriResult(
            api,
            resolved_uri,
            uri_history,
            error
        )
    
    @classmethod
    async def load_uri_resolvers(cls) -> Awaitable[Dict[bool, List[str]]]:
        extendable_uri_resolver = next(filter(x.name == ExtendableUriResolver.name, cls.get_uri_resolvers()), None)
        if not extendable_uri_resolver:
            return {
                "success": True,
                "failed_uri_resolvers": []
            }

        uri_resolver_impls = get_implementations(
            core_interface_uris.uri_resolver,
            cls.get_interfaces(),
            cls.get_redirects()
        )

        return extendable_uri_resolver.load_uri_resolver_wrappers(
            cls,
            cls._api_cache,
            uri_resolver_impls
        )

    @classmethod
    async def query(cls, options: QueryApiOptions) -> Awaitable[QueryApiResult]:
        context_id, should_clear_context = cls._set_context(
            options.context_id,
            options.config
        )

        result = QueryApiResult()

        try:
            typed_options = {
                "uri": cls._to_uri(options.uri)
            } || options

            uri, query, variables = typed_options

            # Convert the query string into a query document
            query_document = create_query_document(query) if isinstance(query, str) else query

            # Parse the query to understand what's being invoked
            query_invocations = parse_query(uri, query_document, variables)

            # Execute all invocations in parallel
            parallel_invocations = []

            for invocation_name in query_invocations:
                invoke_results = cls.invoke(
                    queryInvocations[invocationName],
                    queryInvocations[invocationName].uri,
                    context_id
                )
                parallel_invocations.append({
                    "name": invocation_name,
                    "result": invoke_results
                })

            # Await the invocations
            invocation_results = await parallel_invocations

            # Aggregate all invocation results
            data = {}
            errors = []

            for invocation in parallel_invocations:
                data[invocation.get("name")] = invocation.result.data]
                if invocation.result.error:
                    errors.append(invocation.result.error)

            result = {
                "data": data,
                "errors": errors
            }
        except Exception as e:
            result = {
                "errors": [e]
            }
        
        if should_clear_context:
            cls._clear_context(context_id)

        return result

 

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
  ): Promise<ResolveUriResult> {

  }

  @Tracer.traceMethod("Web3ApiClient: loadUriResolverWrappers")
  public async loadUriResolvers(): Promise<{
    success: boolean;
    failedUriResolvers: string[];
  }> {

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

    if (defaultClientConfig.uriResolvers) {
      this._config.uriResolvers.push(...defaultClientConfig.uriResolvers);
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
    this._sanitizePlugins();
    this._sanitizeInterfacesAndImplementations();
  }

  // Make sure plugin URIs are unique
  // If not, use the first occurrence of the plugin
  @Tracer.traceMethod("Web3ApiClient: sanitizePlugins")
  private _sanitizePlugins(): void {
    const plugins = this._config.plugins;
    // Plugin map used to keep track of plugins with same URI
    const addedPluginsMap = new Map<string, PluginPackage>();

    for (const plugin of plugins) {
      const pluginUri = plugin.uri.uri;

      if (!addedPluginsMap.has(pluginUri)) {
        // If the plugin is not added yet then add it
        addedPluginsMap.set(pluginUri, plugin.plugin);
      }
      // If the plugin with the same URI is already added, then ignore it
      // This means that if the developer defines a plugin with the same URI as a default plugin
      // we will ignore the default one and use the developer's plugin
    }

    // Collection of unique plugins
    const sanitizedPlugins: PluginRegistration<Uri>[] = [];

    // Go through the unique map of plugins and add them to the sanitized plugins
    for (const [uri, plugin] of addedPluginsMap) {
      sanitizedPlugins.push({
        uri: new Uri(uri),
        plugin: plugin,
      });
    }

    this._config.plugins = sanitizedPlugins;
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
      uriResolvers: context?.uriResolvers ?? config.uriResolvers,
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
  private async _loadWeb3Api(uri: Uri, options?: Contextualized): Promise<Api> {
    const { api, uriHistory, error } = await this.resolveUri(uri, {
      contextId: options?.contextId,
    });

    if (!api) {
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
        ): Promise<ResolveUriResult> => {
          return client.resolveUri(uri, { ...options, contextId });
        },
        loadUriResolvers: (): Promise<{
          success: boolean;
          failedUriResolvers: string[];
        }> => {
          return client.loadUriResolvers();
        },
      }
    : client;
