from __future__ import annotations
from dataclasses import dataclass


@dataclass
class ResolveUriOptions:
    """Options required for a URI resolution."""

    no_cache_read: bool = False
    """If set to true, the resolveUri function will not use the cache to resolve the uri"""
    no_cache_write = False
    """If set to true, the resolveUri function will not cache the results"""
    config: ClientConfig = None
    """Override the client's config for all resolutions"""
    context_id: str = ''
    """Id used to track context data set internally"""
