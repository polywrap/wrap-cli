from __future__ import annotations
from abc import ABC, abstractmethod
from result import Result

from dataclasses import dataclass
from typing import Optional

from .uri import Uri
from ..uri_resolution.uri_resolution_context import IUriResolutionContext
from ..types.uri_package_wrapper import UriPackageOrWrapper

class UriResolverHandler(ABC):
    @abstractmethod
    def try_resolve_uri(self, options: Optional[TryResolveUriOptions] = None) -> Result[UriPackageOrWrapper, Exception]:
        pass


@dataclass(slots=True, kw_only=True)
class TryResolveUriOptions:
    uri: Uri
    resolution_context: Optional[IUriResolutionContext] = None
