from __future__ import annotations

from ....algorithms import apply_redirects
from ....types import Client, Uri, WrapperCache
from ...core import UriResolutionResult, UriResolutionStack, UriResolver


class RedirectsResolver(UriResolver):
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
        redirect_uri = apply_redirects(
            uri, client.get_redirects()
        )

        return UriResolutionResult(uri=redirect_uri)
