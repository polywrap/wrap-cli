from abc import ABC, abstractmethod

from result import Result

from ...types import Client, Uri, UriPackageOrWrapper
from .uri_resolution_context import IUriResolutionContext


class IUriResolver(ABC):
    @abstractmethod
    def try_resolve_uri(
        self, uri: Uri, client: Client, resolution_context: IUriResolutionContext
    ) -> Result[UriPackageOrWrapper, Exception]:
        pass
