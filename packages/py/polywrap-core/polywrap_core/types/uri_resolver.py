from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from .uri import Uri
from ..uri_resolution.abc import IUriResolutionContext

@dataclass(slots=True, kw_only=True)
class TryResolveUriOptions:
    """
    Args:
        no_cache_read: If set to true, the resolveUri function will not use the cache to resolve the uri.
        no_cache_write: If set to true, the resolveUri function will not cache the results
        config: Override the client's config for all resolutions.
        context_id: Id used to track context data set internally.
    """
    uri: Uri
    resolution_context: Optional[IUriResolutionContext] = None
