from typing import List, Optional

from result import Err, Ok, Result

from ..types.abc import IWrapPackage, Wrapper
from ..types.uri import Uri
from ..types.uri_package import UriPackage
from ..types.uri_package_wrapper import UriPackageOrWrapper
from ..types.uri_wrapper import UriWrapper
from .uri_resolution_step import UriResolutionStep


class UriResolutionResult:
    result: Result[UriPackageOrWrapper, Exception]
    history: Optional[List[UriResolutionStep]]

    @staticmethod
    def ok(
        uri: Uri, package: Optional[IWrapPackage] = None, wrapper: Optional[Wrapper] = None
    ) -> Result[UriPackageOrWrapper, Exception]:
        if wrapper:
            return Ok(UriWrapper(uri=uri, wrapper=wrapper))
        elif package:
            return Ok(UriPackage(uri=uri, package=package))
        else:
            return Ok(uri)

    @staticmethod
    def err(error: Exception) -> Result[UriPackageOrWrapper, Exception]:
        return Err(error)
