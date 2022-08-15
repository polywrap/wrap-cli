from __future__ import annotations

from dataclasses import dataclass

from . import ResolveUriErrorType


@dataclass(slots=True, kw_only=True)
class ResolveUriError:
    type: ResolveUriErrorType
    error: Exception = None
