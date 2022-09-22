from abc import ABC, abstractmethod
from typing import Optional

from result import Result

from ..uri_resolver import TryResolveUriOptions
from ..uri_package_wrapper import UriPackageOrWrapper


class UriResolverHandler(ABC):
    @abstractmethod
    async def try_resolve_uri(self, options: Optional[TryResolveUriOptions] = None) -> Result[UriPackageOrWrapper, Exception]:
        pass
