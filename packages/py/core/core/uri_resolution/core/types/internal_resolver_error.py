from __future__ import annotations

from dataclasses import dataclass

from . import ResolveUriError, ResolveUriErrorType


@dataclass(slots=True, kw_only=True)
class InternalResolverError(ResolveUriError):
    type = ResolveUriErrorType.InternalResolver
