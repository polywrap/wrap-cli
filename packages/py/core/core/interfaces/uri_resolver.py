from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from ..types import InvokeOptions, Invoker, InvokeResult, Uri


@dataclass(slots=True, kw_only=True)
class MaybeUriOrManifest:
    uri: Optional[str] = None
    manifest: Optional[str] = None


class UriResolverInterface:
    @staticmethod
    async def try_resolve_uri(invoker: Invoker, wrapper_uri: Uri, uri: Uri) -> InvokeResult:
        return await invoker.invoke(
            InvokeOptions(
                uri=wrapper_uri,
                method="try_resolve_uri",
                args={
                    "authority": uri.authority,
                    "path": uri.path,
                },
            )
        )

    @staticmethod
    async def get_file(invoker: Invoker, wrapper_uri: Uri, path: str) -> InvokeResult:
        return await invoker.invoke(
            InvokeOptions(
                uri=wrapper_uri,
                method="get_file",
                args={
                    "path": path,
                },
            )
        )
