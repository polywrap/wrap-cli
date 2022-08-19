from __future__ import annotations

from dataclasses import dataclass

from ....types import Uri


@dataclass(slots=True, kw_only=True)
class UriResult:
    uri: Uri
    is_wrapper: bool


@dataclass(slots=True, kw_only=True)
class UriResolutionInfo:
    uri_resolver: str
    source_uri: Uri
    result: UriResult
