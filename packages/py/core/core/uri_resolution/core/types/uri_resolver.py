from __future__ import annotations

from abc import ABC, abstractmethod

from ....types import Client, Uri, WrapperCache
from .uri_resolution_result import UriResolutionResult
from .uri_resolution_stack import UriResolutionStack


class UriResolver(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    async def resolve_uri(
        self, uri: Uri, client: Client, cache: WrapperCache, resolution_path: UriResolutionStack
    ) -> UriResolutionResult:
        pass
