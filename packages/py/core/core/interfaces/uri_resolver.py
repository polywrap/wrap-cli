from __future__ import annotations

from dataclasses import dataclass
from typing import Awaitable, Optional

from ..types import InvokeOptions, Invoker, InvokeResult, Uri


@dataclass(slots=True, kw_only=True)
class MaybeUriOrManifest:
    uri: Optional[str] = None
    manifest: Optional[str] = None


class UriResolverInterface:
    @staticmethod
    async def try_resolve_uri(invoker: Invoker, api: Uri, uri: Uri) -> Awaitable[MaybeUriOrManifest]:
        return await invoker.invoke(
            InvokeOptions(
                uri=api.uri,
                method="try_resolve_uri",
                input={
                    "authority": uri.authority,
                    "path": uri.path,
                },
            )
        )

    @staticmethod
    async def get_file(invoker: Invoker, api: Uri, path: str) -> Awaitable[InvokeResult]:
        return await invoker.invoke(
            InvokeOptions(
                uri=api.uri,
                method="get_file",
                input={
                    "path": path,
                },
            )
        )
