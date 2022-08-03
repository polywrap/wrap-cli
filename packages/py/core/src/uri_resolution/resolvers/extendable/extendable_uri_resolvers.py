from __future__ import annotations
import queue
from dataclasses import dataclass
from typing import Awaitable, Dict, List

from ...core.types.uri_resolution_result import UriResolutionResult
from ...core import UriResolver, UriResolutionStack
from .uri_resolver_wrapper import UriResolverWrapper
from .... import get_implementations, CoreInterfaceUris, GetInterfacesOptions, GetRedirectsOptions


@dataclass
class ExtendableUriResolverResult(UriResolutionResult):
    implementation_uri: Uri = None


class ExtendableUriResolver(UriResolver):
    def __init__(
        self,
        _create_api: CreateApiFunc,
        _deserialize_options: DeserializeManifestOptions = None,
        disable_preload: bool = False,
    ):
        self._create_api = _create_api
        self._deserialize_options = _deserialize_options
        if disable_preload:
            self._has_loaded_uri_resolvers = True

    @property
    def name(self) -> str:
        return type(self).__name__

    async def resolve_uri(
        self, uri: Uri, client: Client, cache: ApiCache, resolution_path: UriResolutionStack
    ) -> Awaitable(ExtendableUriResolverResult):
        uri_resolver_impls = get_implementations(
            CoreInterfaceUris.uri_resolver,
            client.get_interfaces(GetInterfacesOptions("")),
            client.get_redirects(GetRedirectsOptions("")),
        )

        if not self._has_loaded_uri_resolvers:
            success, failed_uri_resolvers = await self.load_uri_resolver_wrappers(client, cache, uri_resolver_impls)

            if not success:
                return ExtendableUriResolverResult(
                    uri=uri,
                    error=Exception(
                        f"""Could not load the following URI Resolver 
                            implementations: {failed_uri_resolvers}"""
                    ),
                )

            self._has_loaded_uri_resolvers = True

        resolvers = await self._create_uri_resolver_wrappers(uri_resolver_impls)

        for resolver in resolvers:
            result = await resolver.resolve_uri(uri, client, cache, resolution_path)

            if result.api or (result.uri and uri.uri != result.uri.uri):
                return ExtendableUriResolverResult(
                    uri=result.uri, api=result.api, implementation_uri=resolver.implementation_uri
                )

        return ExtendableUriResolverResult(uri=uri)

    async def load_uri_resolver_wrappers(
        self, client: Client, cache: ApiCache, implementation_uris: List[Uri]
    ) -> Awaitable(Dict[bool, List[str]]):
        bootstrap_uri_resolvers = list(filter(lambda x: x.name != self.name, client.get_uri_resolvers({})))

        implementations_to_load = queue.Queue()

        for implementation_uri in implementation_uris:
            if not implementation_uri.uri in cache:
                implementations_to_load.put(implementation_uri)

        implementation_uri = None
        failed_attempts = 0

        while implementation_uri == implementations_to_load.get():
            # Use only the bootstrap resolvers to resolve the resolverUri
            # If successful, it is automatically cached
            api = await client.resolve_uri(implementation_uri, {"config": {"uri_resolvers": bootstrap_uri_resolvers}})

            if not api:
                # If not successful, add the resolver to the end of the queue
                implementations_to_load.put(implementation_uri)
                failed_attempts += 1

                if failed_attempts == len(implementations_to_load):
                    return {"success": False, "failed_uri_resolvers": list(x.uri for x in implementations_to_load)}
                else:
                    # If successful, it is automatically cached during the resolveUri method
                    failed_attempts = 0

        self._has_loaded_uri_resolvers = True

        return {"success": True, "failed_uri_resolvers": []}

    async def _create_uri_resolver_wrappers(
        self, implementation_uris: List[Uri]
    ) -> Awaitable(List[UriResolverWrapper]):
        uri_resolver_impls = []

        for implementation_uri in implementation_uris:
            uri_resolver_impl = UriResolverWrapper(implementation_uri, self._create_api, self._deserialize_options)
            uri_resolver_impls.append(uri_resolver_impl)

        return uri_resolver_impls
