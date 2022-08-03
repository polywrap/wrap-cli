from __future__ import annotations
from dataclasses import dataclass
from typing import Awaitable

from .. import InvokeApiOptions, InvokeApiResult


@dataclass
class MaybeUriOrManifest:
    uri: str = ""
    manifest: str = ""


class UriResolverInterface:
    @classmethod
    async def try_resolve_uri(cls, invoke: InvokeHandler, api: Uri, uri: Uri) -> Awaitable[MaybeUriOrManifest]:
        return await invoke(
            InvokeApiOptions(
                uri=api.uri,
                method="try_resolve_uri",
                input={
                    "authority": uri.authority,
                    "path": uri.path,
                },
            )
        )

    @classmethod
    async def get_file(cls, invoke: InvokeHandler, api: Uri, path: str) -> Awaitable[InvokeApiResult]:
        return await invoke(
            InvokeApiOptions(
                uri=api.uri,
                method="get_file",
                input={
                    "path": path,
                },
            )
        )
