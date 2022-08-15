from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from ....types import Uri, Wrapper
from . import ResolveUriError, UriResolutionHistory


@dataclass(slots=True, kw_only=True)
class ResolveUriResult:
    uri_history: UriResolutionHistory
    api: Optional[Wrapper] = None
    uri: Optional[Uri] = None
    error: Optional[ResolveUriError] = None
