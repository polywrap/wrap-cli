from __future__ import annotations
from dataclasses import dataclass


@dataclass
class ResolveUriResult:
    uri_history: UriResolutionHistory
    api: Api = None
    uri: Uri = None
    error: ResolveUriError = None
