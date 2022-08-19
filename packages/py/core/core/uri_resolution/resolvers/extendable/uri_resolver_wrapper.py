from __future__ import annotations

from typing import Optional, TypedDict, Union

from .types import CreateWrapperFunc

from ....interfaces import UriResolverInterface, MaybeUriOrManifest
from ....types import Client, Invoker, Uri, WrapperCache, DeserializeManifestOptions, deserialize_wrap_manifest
from ...core import UriResolutionResult, UriResolutionStack, UriResolver
from ..get_env_from_uri_or_resolution import get_env_from_uri_or_resolution_stack


class MaybeUriOrManifestDict(TypedDict):
    uri: Optional[str]
    manifest: Optional[str]

class UriResolverWrapper(UriResolver):
    def __init__(
        self,
        implementation_uri: Uri,
        create_wrapper: CreateWrapperFunc,
        deserialize_options: Optional[DeserializeManifestOptions] = None,
    ):
        self.implementation_uri = implementation_uri
        self.create_wrapper = create_wrapper
        self.deserialize_options = deserialize_options

    @property
    def name(self) -> str:
        return type(self).__name__

    async def resolve_uri(
        self,
        uri: Uri,
        client: Client,
        cache: WrapperCache,
        resolution_path: UriResolutionStack,
    ) -> UriResolutionResult:
        result = await try_resolve_uri_with_implementation(
            uri, self.implementation_uri, client
        )

        if not result:
            return UriResolutionResult(uri)

        if result.uri:
            return UriResolutionResult(uri=Uri(result.uri))
        elif result.manifest:
            # We've found our manifest at the current implementation,
            # meaning the URI resolver can also be used as an API resolver
            manifest = deserialize_wrap_manifest(
                result.manifest, self.deserialize_options
            )

            environment = get_env_from_uri_or_resolution_stack(
                uri, resolution_path, client
            )

            wrapper = self.create_wrapper(
                uri, manifest, self.implementation_uri.uri, environment
            )

            return UriResolutionResult(uri, wrapper)

        return UriResolutionResult(uri)


async def try_resolve_uri_with_implementation(
    uri: Uri, implementation_uri: Uri, invoker: Invoker
) -> Union[MaybeUriOrManifest, None]:
    result = await UriResolverInterface.try_resolve_uri(invoker, implementation_uri, uri)
    data: Union[MaybeUriOrManifestDict, None] = result.data

    # If nothing was returned, the URI is not supported
    if not data or (not data.get("uri") and not data.get("manifest")):
        return None

    return MaybeUriOrManifest(**data)
