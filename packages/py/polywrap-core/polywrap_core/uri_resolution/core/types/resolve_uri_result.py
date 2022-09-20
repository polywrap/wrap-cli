from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from ....types import Uri, Wrapper
from .resolve_uri_error import ResolveUriError
from .uri_resolution_history import UriResolutionHistory


@dataclass(slots=True, kw_only=True)
class ResolveUriResult:
    uri_history: UriResolutionHistory
    wrapper: Optional[Wrapper] = None
    uri: Optional[Uri] = None
    error: Optional[ResolveUriError] = None
