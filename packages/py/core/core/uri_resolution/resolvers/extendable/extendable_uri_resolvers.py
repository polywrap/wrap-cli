from __future__ import annotations

from collections import deque
from dataclasses import astuple, dataclass
from typing import Deque, List, Optional

from ....algorithms import get_implementations
from ....interfaces import CoreInterfaceUris
from ....types import Client, DeserializeManifestOptions, ResolveUriOptions, Uri, WrapperCache
from ....types.client import ClientConfig
from ...core.types import UriResolutionResult, UriResolutionStack, UriResolver
from .types import CreateWrapperFunc
from .uri_resolver_wrapper import UriResolverWrapper


@dataclass(slots=True, kw_only=True)
class ExtendableUriResolverResult(UriResolutionResult):
    implementation_uri: Optional[Uri] = None


@dataclass(slots=True, kw_only=True)
class LoadedUriResolvers:
    success: bool
    failed_uri_resolvers: List[str]


class ExtendableUriResolver(UriResolver):
    def __init__(
        self,
        _create_wrapper: CreateWrapperFunc,
        _deserialize_options: Optional[DeserializeManifestOptions] = None,
        disable_preload: Optional[bool] = False,
    ):
        self._create_api = _create_wrapper
        self._deserialize_options = _deserialize_options
        if disable_preload:
            self._has_loaded_uri_resolvers = True

    @property
    def name(self) -> str:
        return type(self).__name__

    async def resolve_uri(
        self,
        uri: Uri,
        client: Client,
        cache: WrapperCache,
        resolution_path: UriResolutionStack,
    ) -> ExtendableUriResolverResult:
        uri_resolver_impls = get_implementations(
            CoreInterfaceUris.uri_resolver.value,
            client.get_interfaces(),
            client.get_redirects(),
        )

        if not self._has_loaded_uri_resolvers:
            success, failed_uri_resolvers = astuple(
                await self.load_uri_resolver_wrappers(client, cache, uri_resolver_impls)
            )

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

            if result.wrapper or (result.uri and uri != result.uri):
                return ExtendableUriResolverResult(
                    uri=result.uri,
                    wrapper=result.wrapper,
                    implementation_uri=resolver.implementation_uri,
                )

        return ExtendableUriResolverResult(uri=uri)

    async def load_uri_resolver_wrappers(
        self, client: Client, cache: WrapperCache, implementation_uris: List[Uri]
    ) -> LoadedUriResolvers:
        bootstrap_uri_resolvers = list(filter(lambda x: x.name != self.name, client.get_uri_resolvers()))

        implementations_to_load: Deque[Uri] = deque()

        for implementation_uri in implementation_uris:
            if not implementation_uri.uri in cache:
                implementations_to_load.append(implementation_uri)

        implementation_uri: Uri
        failed_attempts = 0

        while implementation_uri := implementations_to_load.popleft():
            # Use only the bootstrap resolvers to resolve the resolverUri
            # If successful, it is automatically cached
            wrapper = await client.resolve_uri(
                implementation_uri, ResolveUriOptions(config=ClientConfig(uri_resolvers=bootstrap_uri_resolvers))
            )

            if not wrapper:
                # If not successful, add the resolver to the end of the queue
                implementations_to_load.append(implementation_uri)
                failed_attempts += 1

                if failed_attempts == len(implementations_to_load):
                    return LoadedUriResolvers(
                        success=False, failed_uri_resolvers=[x.uri for x in implementations_to_load]
                    )
                else:
                    # If successful, it is automatically cached during the resolveUri method
                    failed_attempts = 0

        self._has_loaded_uri_resolvers = True

        return LoadedUriResolvers(success=True, failed_uri_resolvers=[])

    async def _create_uri_resolver_wrappers(self, implementation_uris: List[Uri]) -> List[UriResolverWrapper]:
        uri_resolver_impls: List[UriResolverWrapper] = []

        for implementation_uri in implementation_uris:
            uri_resolver_impl = UriResolverWrapper(implementation_uri, self._create_api, self._deserialize_options)
            uri_resolver_impls.append(uri_resolver_impl)

        return uri_resolver_impls
