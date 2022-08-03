from __future__ import annotations
from typing import Awaitable

from ....algorithms import apply_redirects
from ...core import UriResolver, UriResolutionResult
from .... import GetRedirectsOptions


class RedirectsResolver(UriResolver):
    @property
    def name(self) -> str:
        return type(self).__name__

    async def resolve_uri(
        self, uri: Uri, client: Client, cache: ApiCache, resolution_path: UriResolutionStack
    ) -> Awaitable(UriResolutionResult):
        redirect_uri = apply_redirects(uri, client.get_redirects(GetRedirectsOptions("")))

        return UriResolutionResult(uri=redirect_uri)
