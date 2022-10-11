from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from result import Result

from .uri_resolver import TryResolveUriOptions

if TYPE_CHECKING:
    from .uri_package_wrapper import UriPackageOrWrapper

class UriResolverHandler(ABC):
    @abstractmethod
    async def try_resolve_uri(self, options: TryResolveUriOptions) -> Result["UriPackageOrWrapper", Exception]:
        pass
