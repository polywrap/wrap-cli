from typing import Dict

from polywrap_core import (
    Uri,
    IUriResolver,
    Client,
    IUriResolutionContext,
)
from result import Result, Ok

class RedirectUriResolver(IUriResolver):
    _redirects: Dict[Uri, Uri]

    def __init__(self, redirects: Dict[Uri, Uri]):
        self._redirects = redirects

    async def try_resolve_uri(
        self, uri: Uri, client: Client, resolution_context: IUriResolutionContext
    ) -> Result[Uri, Exception]:
        return Ok(self._redirects[uri]) if uri in self._redirects else Ok(uri)
