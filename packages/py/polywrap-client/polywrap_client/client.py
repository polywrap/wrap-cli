from __future__ import annotations
from dataclasses import dataclass
from typing import Optional

from polywrap_core import (
    Client,
    ClientConfig,
    Uri,
    InvokeOptions,
    InvokeResult,
    UriResolutionContext,
    IUriResolutionContext,
    Wrapper,
    TryResolveUriOptions
)


@dataclass
class PolywrapClientConfig(ClientConfig):
    pass

class PolywrapClient(Client):
    def __init__(self, config: Optional[PolywrapClientConfig]=None):
        self._config = PolywrapClientConfig()
        try:
            if config:
                self._config = PolywrapClientConfig()

            # self._validate_config()
            # self._sanitize_config()

        except Exception:
            raise

    async def invoke(self, options: InvokeOptions) -> InvokeResult:
        try:
            wrapper = self._load_wrapper(options.uri)
            return await wrapper.invoke(options)

        except Exception as e:
            result = e

        return result

    async def _load_wrapper(self, uri: Uri, resolution_context: IUriResolutionContext = None) -> Wrapper:
        if not resolution_context:
            resolution_context = UriResolutionContext()

        result = self.try_resolve_uri({
            uri,
            resolution_context
        })

        if not result.ok and result.error:
            #return ResultErr(UriResolverError(error=result.error, context=resolution_context))
            raise UriResolverError(error=result.error)
        else:
            """
            return ResultErr(Error(f"Error resolving URI {uri.uri}"))
            """
            raise f"Error resolving URI {uri.uri}"

        

    async def try_resolve_uri(self, options: TryResolveUriOptions):
        pass

    # def get_envs(self, options: GetEnvsOptions) -> List[Env]:
    #     return self._get_config(options.context_id).envs

    # def get_env_by_uri(self, uri: Union[Uri, str], options: GetEnvsOptions) -> Union[Env, None]:
    #     uri_uri = self._to_uri(uri)
    #
    #     return next((x for x in self.get_envs(options) if Uri.equals(x.uri, uri_uri)), [None])

    # def get_uri_resolvers(self, options: GetUriResolversOptions) -> List[UriResolver]:
    #     return self._get_config(options.context_id).uri_resolvers

    # async def resolve_uri(self, uri: Union[Uri, str], options: Optional[ResolveUriOptions] = None) -> Awaitable[ResolveUriResult]:
    #     options = options if options else GetRedirectsOptions(context_id="")
    #     context_id, should_clear_context = self._set_context(
    #         options.context_id,
    #         options.config
    #     )
    #
    #     ignore_cache = self._is_contextualized(context_id)
    #     cache_write = not ignore_cache and options and not options.no_cache_write
    #     cache_read = not ignore_cache and options and not options.no_cache_read
    #
    #     client = contextualize_client(self, context_id)
    #
    #     uri_resolvers = self.get_uri_resolvers(GetUriResolversOptions(context_id=context_id))
    #
    #     if not cache_read:
    #         uri_resolvers = [x for x in uri_resolvers if x.name != CacheResolver.name]
    #
    #     resolve_uri_result = await resolve_uri(
    #         uri=self._to_uri(uri),
    #         uri_resolvers=uri_resolvers,
    #         client=client,
    #         cache=self._api_cache,
    #     )
    #
    #     api = resolve_uri_result.api
    #     resolved_uri = resolve_uri_result.uri
    #     uri_history = resolve_uri_result.uri_history
    #     error = resolve_uri_result.error
    #
    #     # Update cache for all URIs in the chain
    #     if cache_write and api:
    #         for item in uri_history.get_resolution_path().stack:
    #             self._api_cache.set(item.source_uri.uri, api)
    #
    #     if should_clear_context:
    #         self._clear_context(context_id)
    #
    #     return ResolveUriResult(
    #         api=api,
    #         uri=resolved_uri,
    #         uri_history=uri_history,
    #         error=error
    #     )

    # async def load_uri_resolvers(self) -> Awaitable[Dict[bool, List[str]]]:
    #     extendable_uri_resolver = next(filter(x.name == ExtendableUriResolver.name, self.get_uri_resolvers()), None)
    #     if not extendable_uri_resolver:
    #         return {
    #             "success": True,
    #             "failed_uri_resolvers": []
    #         }
    #
    #     uri_resolver_impls = get_implementations(
    #         CoreInterfaceUris.uri_resolver.value,
    #         self.get_interfaces(),
    #         self.get_redirects()
    #     )
    #
    #     return extendable_uri_resolver.load_uri_resolver_wrappers(
    #         self,
    #         self._api_cache,
    #         uri_resolver_impls
    #     )

    # def _get_config(self, context_id: str = None) -> PolywrapClientConfig:
    #     if context_id:
    #         context = self._contexts.get(context_id)
    #         if not context:
    #             raise ValueError(f"No invoke context found with id: {context_id}")
    #         return context
    #     else:
    #         return self._config
