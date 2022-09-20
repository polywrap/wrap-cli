from __future__ import annotations

from dataclasses import dataclass

from .resolve_uri_error import ResolveUriError, ResolveUriErrorType


@dataclass(slots=True, kw_only=True)
class InternalResolverError(ResolveUriError):
    resolver_name: str
    type = ResolveUriErrorType.InternalResolver
