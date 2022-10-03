from abc import ABC, abstractmethod

from result import Result

from ...types.client import Client
from ...types.uri import Uri
from ...types.uri_package_wrapper import UriPackageOrWrapper
from ..uri_resolution_context import IUriResolutionContext


class IUriResolver(ABC):
    @abstractmethod
    def try_resolve_uri(
        self, uri: Uri, client: Client, resolution_context: IUriResolutionContext
    ) -> Result[UriPackageOrWrapper, Exception]:
        pass
