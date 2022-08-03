from __future__ import annotations
from typing import Awaitable, Union

from ....interfaces import UriResolverInterface
from ....manifest import deserialize_web3_api_manifest
from ....types import Uri, Client, InvokeHandler
from ...core import UriResolver, UriResolutionStack, UriResolutionResult
from ....uri_resolution.resolvers.get_env_from_uri_or_resolution import get_env_from_uri_or_resolution_stack


class UriResolverWrapper(UriResolver):
    def __init__(
        self, implementation_uri: Uri, create_api: CreateApiFunc, deserialize_options: DeserializeManifestOptions = None
    ):
        self.implementation_uri = implementation_uri
        self.create_api = create_api
        self.deserialize_options = deserialize_options

    @property
    def name(self) -> str:
        return type(self).__name__

    async def resolve_uri(
        self, uri: Uri, client: Client, cache: ApiCache, resolution_path: UriResolutionStack
    ) -> Awaitable(UriResolutionResult):
        result = await try_resolve_uri_with_implementation(uri, self.implementation_uri, client.invoke)

        if not result:
            return UriResolutionResult(uri)

        if result.get("uri"):
            return UriResolutionResult(uri=Uri(result.get("uri")))
        elif result.get("manifest"):
            # We've found our manifest at the current implementation,
            # meaning the URI resolver can also be used as an API resolver
            manifest = deserialize_web3_api_manifest(result.get("manifest"), self.deserialize_options)

            environment = get_env_from_uri_or_resolution_stack(uri, resolution_path, client)

            api = self.create_api(uri, manifest, self.implementation_uri.uri, environment)

            return UriResolutionResult(uri, api)

        return UriResolutionResult(uri)


async def try_resolve_uri_with_implementation(
    uri: Uri, implementation_uri: Uri, invoke: InvokeHandler["invoke"]
) -> Awaitable(Union[UriResolverInterface.MaybeUriOrManifest, None]):
    result = await UriResolverInterface.try_resolve_uri(invoke, implementation_uri, uri)
    data = result.data

    # If nothing was returned, the URI is not supported
    if not data or (not data.get("uri") and not data.get("manifest")):
        return None

    return data
