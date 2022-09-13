from __future__ import annotations
import uuid
from dataclasses import dataclass

from core import (
    Client,
    ClientConfig,
    sanitize_uri_redirects,
    sanitize_envs,
    sanitize_plugin_registrations,
    sanitize_interface_implementations,
    GetPluginsOptions,
    GetInterfacesOptions,
    CoreInterfaceUris,
    InterfaceImplementations,
    Uri,
    GetImplementationsOptions,
    get_implementations,
    PluginRegistration,
    GetRedirectsOptions,
    resolve_uri,
    ResolveUriOptions,
    GetUriResolversOptions,
    ResolveUriResult,
    GetEnvsOptions,
    CacheResolver,
    Contextualized
)
from .default_client_config import get_default_client_config


@dataclass
class Web3ApiClientConfig(ClientConfig):
    pass


def contextualize_client(client: Web3ApiClient, context_id: str) -> Client:
    if context_id:
        return ContextualizedClient(client, context_id)
    else:
        return client


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
                    redirects = sanitize_uri_redirects(config.redirects) if config.redirects else [],
                    envs = sanitize_envs(config.envs) if config.envs else [],
                    plugins = sanitize_plugin_registrations(config.plugins) if config.plugins else [],
                    interfaces = sanitize_interface_implementations(config.interfaces) if config.interfaces else [],
                    uri_resolvers = config.uri_resolvers if config.uri_resolvers else []
                )

            if not options or not options.get('no_defaults'):
                self._add_default_config()

            self._validate_config()
            self._sanitize_config()

        except Exception:
            raise

    
    def get_redirects(self, options: GetRedirectsOptions) -> List[UriRedirect]:
        return self._get_config(options.context_id).redirects
    
    def get_plugins(self, options: GetPluginsOptions = GetPluginsOptions("")) -> List[PluginRegistration]:
        return self._get_config(options.context_id).plugins
    
    
    def get_interfaces(self, options: GetInterfacesOptions = GetInterfacesOptions("")) -> List[InterfaceImplementations]:
        return self._get_config(options.context_id).interfaces
    
    
    def get_envs(self, options: GetEnvsOptions) -> List[Env]:
        return self._get_config(options.context_id).envs
    
    
    def get_env_by_uri(self, uri: Union[Uri, str], options: GetEnvsOptions) -> Union[Env, None]:  
        uri_uri = self._to_uri(uri)

        return next((x for x in self.get_envs(options) if Uri.equals(x.uri, uri_uri)), [None])
    
    
    def get_uri_resolvers(self, options: GetUriResolversOptions) -> List[UriResolver]:
        return self._get_config(options.context_id).uri_resolvers
    
    
    async def get_schema(self, uri: Union[Uri, str], options: GetSchemaOptions) -> Awaitable[str]:
        api = await self._load_web3_api(self._to_uri(uri), options)
        client = contextualize_client(self, options.context_id)
        return await api.get_schema(client)
    
    
    async def get_manifest(self, uri: Union[Uri, str], options: GetManifestOptions) -> Awaitable[ManifestArtifactType]:
        api = await self._load_web3_api(self._to_uri(uri), options)
        client = contextualize_client(self, options.context_id)
        return await api.get_manifest(options, client)
    
    
    async def get_file(self, uri: Union[Uri, str], options: GetFileOptions) -> Awaitable[Union[Uri, str]]:
        api = await self._load_web3_api(self._to_uri(uri), options)
        client = contextualize_client(self, options.context_id)
        return await api.get_file(options, client)
    
    
    def get_implementations(self, uri: Union[Uri, str], options: GetImplementationsOptions = GetImplementationsOptions("")) -> List[Union[Uri, str]]:
        is_uri_type_string = isinstance(uri, str)
        apply_redirects = options.apply_redirects
        
        return [x.uri for x in get_implementations(
            self._to_uri(uri),
            self.get_interfaces(options),
            self.get_redirects(options) if apply_redirects else None
            )] if is_uri_type_string else get_implementations(
                self._to_uri(uri),
                self.get_interfaces(options),
                self.get_redirects(options) if apply_redirects else None
            )
    
    
    async def resolve_uri(self, uri: Union[Uri, str], options: Optional[ResolveUriOptions] = None) -> Awaitable[ResolveUriResult]:
        options = options if options else GetRedirectsOptions(context_id="")
        context_id, should_clear_context = self._set_context(
            options.context_id,
            options.config
        )

        ignore_cache = self._is_contextualized(context_id)
        cache_write = not ignore_cache and options and not options.no_cache_write
        cache_read = not ignore_cache and options and not options.no_cache_read

        client = contextualize_client(self, context_id)

        uri_resolvers = self.get_uri_resolvers(GetUriResolversOptions(context_id=context_id))

        if not cache_read:
            uri_resolvers = [x for x in uri_resolvers if x.name != CacheResolver.name]

        resolve_uri_result = await resolve_uri(
            uri=self._to_uri(uri),
            uri_resolvers=uri_resolvers,
            client=client,
            cache=self._api_cache,
        )

        api = resolve_uri_result.api
        resolved_uri = resolve_uri_result.uri
        uri_history = resolve_uri_result.uri_history
        error = resolve_uri_result.error

        # Update cache for all URIs in the chain
        if cache_write and api:
            for item in uri_history.get_resolution_path().stack:
                self._api_cache.set(item.source_uri.uri, api)

        if should_clear_context:
            self._clear_context(context_id)
        
        return ResolveUriResult(
            api=api,
            uri=resolved_uri,
            uri_history=uri_history,
            error=error
        )
    
    
    async def load_uri_resolvers(self) -> Awaitable[Dict[bool, List[str]]]:
        extendable_uri_resolver = next(filter(x.name == ExtendableUriResolver.name, self.get_uri_resolvers()), None)
        if not extendable_uri_resolver:
            return {
                "success": True,
                "failed_uri_resolvers": []
            }

        uri_resolver_impls = get_implementations(
            CoreInterfaceUris.uri_resolver.value,
            self.get_interfaces(),
            self.get_redirects()
        )

        return extendable_uri_resolver.load_uri_resolver_wrappers(
            self,
            self._api_cache,
            uri_resolver_impls
        )

    
    async def query(self, options: QueryApiOptions) -> Awaitable[QueryApiResult]:
        context_id, should_clear_context = self._set_context(
            options.context_id,
            options.config
        )

        result = QueryApiResult()

        try:
            typed_options = {
                "uri": self._to_uri(options.uri)
            } | options

            uri, query, variables = typed_options

            # Convert the query string into a query document
            query_document = create_query_document(query) if isinstance(query, str) else query

            # Parse the query to understand what's being invoked
            query_invocations = parse_query(uri, query_document, variables)

            # Execute all invocations in parallel
            parallel_invocations = []

            for invocation_name in query_invocations:
                invoke_results = self.invoke(
                    query_invocations[invocation_name],
                    query_invocations[invocation_name].uri,
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
                data[invocation.get("name")] = invocation.result.data
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
            self._clear_context(context_id)

        return result
    
    
    async def invoke(self, options: InvokeApiOptions) -> Awaitable[InvokeApiResult]:
        context_id, should_clear_context = self._set_context(options.context_id, options.config)

        try:
            typed_options = {
                "context_id": context_id,
                "uri": self._to_uri(options.uri)
            } | options

            api = await self._load_web3_api(typed_options.uri, Contextualized(context_id))

            result = await api.invoke(
                typed_options,
                contextualize_client(self, context_id)
            )

        except Exception as e:
            result = e

        if should_clear_context:
            self._clear_context(context_id)

        return result

    
    def subscribe(self, options: SubscribeOptions) -> Subscription:
        context_id, should_clear_context = self._set_context(
            options.context_id,
            options.config
        )
        this_client = self
        client = contextualize_client(self, context_id)

        typed_options = {
            "uri": self._to_uri(options.uri)
        } | options

        uri, query, variables, freq = typed_options

        #calculate interval between queries, in milliseconds, 1 min default value
        if (freq and (freq.ms or freq.sec or freq.min or freq.hours)):
            frequency = \
                (freq.ms if freq.ms else 0) + \
                ((freq.hours if freq.hours else 0) * 3600 + (freq.min if freq.min else 0) * 60 + (freq.sec if freq.sec else 0)) * \
                1000
        else:
            frequency = 60000
        
        def stop():
            if should_clear_context:
                this_client._clear_context(context_id)
            subscription.is_active = False

        async def async_gen():
            subscription.is_active = True

            def set_interval(func, time):
                e = threading.Event()
                while not e.wait(time):
                    func()
            
            def timout_func():
                ready_vals += 1
                if sleep:
                    sleep()
                    sleep = None

            try:
                ready_vals = 0
                def sleep(value: Any = None):
                    pass
                
                timeout = set_interval(timout_func, frequency)

                async def new_sleep(r):
                    sleep = r

                while subscription.is_active:
                    if ready_vals == 0:
                        await new_sleep
                    
                    for i in range(ready_vals, 0, -1):
                        if not subscription.is_active:
                            break
                    
                    result = await client.query(
                        uri,
                        query,
                        variables,
                        context_id
                    )

                    yield result
            finally:
                if timeout:
                    clear_interval(timeout)
                if should_clear_context:
                    this_client._clear_context(context_id)
                subscription.is_active = False
        

        
        subscription = Subscription(
            frequency=frequency,
            is_active=False,
            stop=stop,
            func=async_gen
        )

        return subscription

    
    def _add_default_config(self):
        default_client_config = get_default_client_config()

        if default_client_config.redirects:
            self._config.redirects += (default_client_config.redirects)

        if default_client_config.plugins:
            self._config.plugins += (default_client_config.plugins)
        
        if default_client_config.interfaces:
            self._config.interfaces += (default_client_config.interfaces)
        
        if default_client_config.uri_resolvers:
            self._config.uri_resolvers += (default_client_config.uri_resolvers)

    
    def _is_contextualized(self, context_id: str) -> bool:
        return context_id and self._contexts.get(context_id)
 

    def _get_config(self, context_id: str = None) -> Web3ApiClientConfig:
        if context_id:
            context = self._contexts.get(context_id)
            if not context:
                raise ValueError(f"No invoke context found with id: {context_id}")
            return context
        else:
            return self._config

    
    def _sanitize_config(self):
        self._sanitize_plugins()
        self._sanitize_interfaces_and_implementations()
    
    
    def _sanitize_plugins(self):
        """
        Make sure plugin URIs are unique
        If not, use the first occurrence of the plugin
        """
        plugins = self._config.plugins

        # Plugin map used to keep track of plugins with same URI
        added_plugins_map = {}

        for plugin in plugins:
            plugin_uri = plugin.uri.uri

            if plugin_uri not in added_plugins_map:
                # If the plugin is not added yet then add it
                added_plugins_map[plugin_uri] = plugin.plugin
            
            # If the plugin with the same URI is already added, then ignore it
            # This means that if the developer defines a plugin with the same URI as a default plugin
            # we will ignore the default one and use the developer's plugin

        # Collection of unique plugins
        sanitized_plugins = []

        # Go through the unique map of plugins and add them to the sanitized plugins
        for uri in added_plugins_map:
            plugin = added_plugins_map[uri]
            sanitized_plugins.append(PluginRegistration(
                uri=Uri(uri),
                plugin=plugin
            ))

        self._config.plugins = sanitized_plugins

    
    def _sanitize_interfaces_and_implementations(self):
        """
        Make sure interface URIs are unique and that all of their implementation URIs are unique
        If not, then merge them
        """
        interfaces = self._config.interfaces

        # Interface hash map used to keep track of interfaces with same URI
        # A set is used to keep track of unique implementation URIs
        added_interfaces_hash_map = {}

        for interface_implementations in interfaces:
            interface_uri = interface_implementations.interface.uri

            if interface_uri not in added_interfaces_hash_map:
                # If the interface is not added yet then just add it along with its implementations
                added_interfaces_hash_map[interface_uri] = set([x.uri for x in interface_implementations.implementations])
            else:            
                # Get implementations to add to existing set of implementations
                new_implementations_uris = [x.uri for x in interface_implementations.implementations]

                # Add new implementations to existing set
                for new_implementations_uri in new_implementations_uris:
                    added_interfaces_hash_map[interface_uri].add(new_implementations_uri)

        # Collection of unique interfaces with implementations merged
        sanitized_interfaces = []

        # Go through the unique hash map of interfaces and implementations and add them to the sanitized interfaces
        for interface_uri in added_interfaces_hash_map:
            implementation_set = list(added_interfaces_hash_map[interface_uri])
            implementation_set.sort()

            sanitized_interfaces.append(InterfaceImplementations(
                interface=Uri(interface_uri),
                implementations=[Uri(x) for x in implementation_set]
            ))
        
        self._config.interfaces = sanitized_interfaces
    
    def _validate_config(self):
        # Require plugins to use non-interface URIs

        plugin_uris = [x.uri.uri for x in self.get_plugins()]
        interface_uris = [x.interface.uri for x in self.get_interfaces()]

        plugins_with_interface_uris = [x for x in plugin_uris if x in interface_uris]

        if len(plugins_with_interface_uris):
            raise ValueError(f"Plugins can't use interfaces for their URI. Invalid plugins: {plugins_with_interface_uris}")

    
    def _to_uri(self, uri: Union[Uri, str]) -> Uri:
        if isinstance(uri, str):
            return Uri(uri)
        elif Uri.is_uri(uri):
            return uri
        else:
            raise ValueError(f"Unknown uri type, cannot convert. {uri}")

    
    def _set_context(self, parent_id: str, context: Web3ApiClientConfig) -> Union(str, bool):
        if not context:
            return parent_id, False
        
        config = self._get_config(parent_id)
        id = uuid.uuid4()

        self._contexts[id] = Web3ApiClientConfig(
            redirects = sanitize_uri_redirects(context.redirects) if context and context.redirects else config.redirects,
            plugins = sanitize_plugin_registrations(context.plugins) if context and context.plugins else config.plugins,
            interfaces = sanitize_interface_implementations(context.interfaces) if context and context.interfaces else config.interfaces,
            envs = sanitize_envs(context.envs) if context and context.envs else config.envs,
            uri_resolvers = context.uri_resolvers if context.uri_resolvers else config.uri_resolvers,
        )

        return id, True
    
    
    def _clear_context(self, context_id: str):
        if context_id:
            self._contexts.pop(context_id, None)
    
    
    async def _load_web3_api(self, uri: Uri, options: Contextualized = None) -> Awaitable[Api]:
        resolve_uri_result = await self.resolve_uri(uri, ResolveUriOptions(context_id=options.context_id) if options else None)

        api = resolve_uri_result.api
        resolved_uri = resolve_uri_result.uri
        uri_history = resolve_uri_result.uri_history
        error = resolve_uri_result.error

        if not api:
            if error:
                error_message = str(error)
                if error.__class__.__name__ == "ResolveUriErrorType.InfiniteLoop":
                    raise ValueError(f"Infinite loop while resolving URI \"{uri}\".\nResolution Stack: {uri_history}")
                elif error.__class__.__name__ == "ResolveUriErrorType.InternalResolver":
                    raise ValueError(f"URI resolution error while resolving URI \"{uri}\".\n{error_message}\nResolution Stack: {uri_history}")
                else:
                    raise ValueError(f"Unsupported URI resolution error type occurred")
            else:
                raise ValueError(f"Unknown URI resolution error while resolving URI \"${uri}\"\nResolution Stack: {uri_history}")

        return api


class ContextualizedClient(Web3ApiClient):
    def __init__(self, client: Web3ApiClient, context_id: str):
        self.client = client
        self.context_id = context_id

    
    async def query(self, options: QueryApiOptions) -> Awaitable[QueryApiResult]:
        return self.client.query(
            QueryApiOptions(
                uri = options.uri,
                query = options.query,
                variables = options.variables,
                config = options.config,
                context_id = self.context_id
            )
        )

    
    async def invoke(self, options: InvokeApiOptions) -> Awaitable[InvokeApiResult]:
        return self.client.invoke(
            InvokeApiOptions(
                uri = options.uri,
                method = options.method,
                input = options.input,
                result_filter = options.result_filter,
                no_decode = options.no_decode,
                config = options.config,
                context_id = self.context_id
            )
        )

    
    def subscribe(self, options: SubscribeOptions) -> Subscription:
        return self.client.subscribe(
            SubscribeOptions(
                uri = options.uri,
                query = options.query,
                variables = options.variables,
                config = options.config,
                context_id = self.context_id,
                frequency = options.frequency,
            )
        )

    
    def get_redirects(self, options: GetRedirectsOptions = None) -> List[UriRedirect]:
        return self.client.get_redirects(
            GetRedirectsOptions(
                context_id = self.context_id
            )
        )

    
    def get_plugins(self, options: GetPluginsOptions = GetPluginsOptions("")) -> List[PluginRegistration]:
        return self.client.get_plugins(
            GetPluginsOptions(
                context_id = self.context_id
            )
        )

    
    def get_interfaces(self, options: GetInterfacesOptions = GetInterfacesOptions("")) -> List[InterfaceImplementations]:
        return self.client.get_interfaces(
            GetInterfacesOptions(
                context_id = self.context_id
            )
        )
    
    
    def get_envs(self, options: GetEnvsOptions = None) -> List[Env]:
        return self.client.get_interfaces(
            GetEnvsOptions(
                context_id = self.context_id
            )
        )
    
    
    def get_env_by_uri(self, uri: Union[Uri, str], options: GetEnvsOptions = None) -> Union[Env, None]:
        return self.client.get_env_by_uri(
            uri,
            GetEnvsOptions(
                context_id = self.context_id
            )
        )

    
    def get_uri_resolvers(self, options: GetUriResolversOptions = None) -> List[UriResolver]:
        return self.client.get_uri_resolvers(
            GetUriResolversOptions(
                context_id = self.context_id
            )
        )

    
    async def get_schema(self, uri: Union[Uri, str], options: GetSchemaOptions = None) -> Awaitable[str]:
        return self.client.get_schema(
            uri,
            GetSchemaOptions(
                context_id = self.context_id
            )
        )
    
    
    async def get_manifest(self, uri: Union[Uri, str], options: GetManifestOptions) -> Awaitable[ManifestArtifactType]:
        return self.client.get_manifest(
            uri,
            GetManifestOptions(
                context_id = self.context_id,
                type = options.type
            )
        )
    
    
    async def get_file(self, uri: Union[Uri, str], options: GetFileOptions) -> Awaitable[Union[Uri, str]]:
        return self.client.get_file(
            uri,
            GetFileOptions(
                context_id = self.context_id,
                path = options.path,
                encoding = options.encoding
            )
        )
    
    
    def get_implementations(self, uri: Union[Uri, str], options: GetImplementationsOptions = GetImplementationsOptions("")) -> List[Union[Uri, str]]:
        return self.client.get_implementations(
            uri,
            GetImplementationsOptions(
                context_id = self.context_id,
                apply_redirects = options.apply_redirects
            )
        )

    
    async def load_uri_resolvers(self) -> Awaitable[Dict[bool, List[str]]]:
        return self.client.load_uri_resolvers()





