from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Awaitable

from ....types import Client, Uri
from . import UriResolutionResult, UriResolutionStack


class UriResolver(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    async def resolve_uri(
        self, uri: Uri, client: Client, resolution_path: UriResolutionStack
    ) -> Awaitable[UriResolutionResult]:
        pass
