from __future__ import annotations
from typing import Awaitable

from ...core import UriResolver, UriResolutionResult


class CacheResolver(UriResolver):
    @property
    def name(self) -> str:
        return self.__name__

    async def resolve_uri(
        self, uri: Uri, client: Client, cache: ApiCache, resolution_path: UriResolutionStack = None
    ) -> Awaitable(UriResolutionResult):
        api = cache.get(uri.uri)

        return UriResolutionResult(uri=uri, api=api)
