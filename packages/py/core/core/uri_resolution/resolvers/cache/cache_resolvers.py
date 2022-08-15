from __future__ import annotations

from typing import Awaitable, Optional

from ....types import Client, Uri, WrapperCache
from ...core import UriResolutionResult, UriResolutionStack, UriResolver

class CacheResolver(UriResolver):
    @property
    def name(self) -> str:
        return self.__name__

    async def resolve_uri(
        self, uri: Uri, client: Client, cache: WrapperCache, resolution_path: Optional[UriResolutionStack] = None
    ) -> Awaitable(UriResolutionResult):
        wrapper = cache.get(uri.uri)

        return UriResolutionResult(uri=uri, wrapper=wrapper)
