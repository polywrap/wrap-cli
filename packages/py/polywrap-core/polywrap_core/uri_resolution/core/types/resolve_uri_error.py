from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from .resolve_uri_error_type import ResolveUriErrorType


@dataclass(slots=True, kw_only=True)
class ResolveUriError:
    type: Optional[ResolveUriErrorType] = None
    error: Optional[Exception] = None
