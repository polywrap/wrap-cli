from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING, List, Optional

from .uri import Uri

if TYPE_CHECKING:
    from .client import ClientConfig
    from ..uri_resolution import ResolveUriResult


@dataclass(slots=True, kw_only=True)
class ResolveUriOptions:
    """
    Args:
        no_cache_read: If set to true, the resolveUri function will not use the cache to resolve the uri.
        no_cache_write: If set to true, the resolveUri function will not cache the results
        config: Override the client's config for all resolutions.
        context_id: Id used to track context data set internally.
    """

    no_cache_read: Optional[bool] = False
    no_cache_write: Optional[bool] = False
    config: Optional["ClientConfig"] = None
    context_id: Optional[str] = None


@dataclass(slots=True, kw_only=True)
class LoadUriResolversResult:
    success: bool
    failed_uri_resolvers: List[str]


class UriResolverHandler(ABC):
    @abstractmethod
    async def resolve_uri(self, uri: Uri, options: Optional[ResolveUriOptions] = None) -> "ResolveUriResult":
        pass

    @abstractmethod
    def load_uri_resolvers(self) -> LoadUriResolversResult:
        pass
