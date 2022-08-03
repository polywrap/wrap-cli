from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Awaitable


class UriResolver(ABC):
    @property
    @classmethod
    @abstractmethod
    def name(cls) -> str:
        return

    @classmethod
    @abstractmethod
    def resolve_uri(
        cls, uri: Uri, client: Client, resolution_path: UriResolutionStack
    ) -> Awaitable[UriResolutionResult]:
        return
