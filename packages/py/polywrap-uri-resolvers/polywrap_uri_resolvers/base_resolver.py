from typing import List, Dict
from polywrap_core import (
    Uri,
    IUriResolver,
    UriPackageOrWrapper,
    Client,
    IUriResolutionContext,
    IFileReader,
)
from result import Result

from .fs_resolver import FsUriResolver
from .redirect_resolver import RedirectUriResolver


class BaseUriResolver(IUriResolver):
    _fs_resolver: FsUriResolver
    _redirect_resolver: RedirectUriResolver

    def __init__(self, file_reader: IFileReader, redirects: Dict[Uri, Uri]):
        self._fs_resolver = FsUriResolver(file_reader)
        self._redirect_resolver = RedirectUriResolver(redirects)

    async def try_resolve_uri(
        self, uri: Uri, client: Client, resolution_context: IUriResolutionContext
    ) -> Result[UriPackageOrWrapper, Exception]:
        redirected_uri = (
            await self._redirect_resolver.try_resolve_uri(
                uri, client, resolution_context
            )
        ).unwrap()

        print(redirected_uri)

        return await self._fs_resolver.try_resolve_uri(
            redirected_uri, client, resolution_context
        )
