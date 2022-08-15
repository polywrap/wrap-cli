from __future__ import annotations

from typing import Awaitable

from ....algorithms import apply_redirects
from ....types import Client, GetRedirectsOptions, Uri, WrapperCache
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
    ) -> Awaitable(UriResolutionResult):
        redirect_uri = apply_redirects(
            uri, client.get_redirects(GetRedirectsOptions(""))
        )

        return UriResolutionResult(uri=redirect_uri)
