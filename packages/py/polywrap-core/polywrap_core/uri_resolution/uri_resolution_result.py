from typing import List, Optional

from result import Err, Ok, Result

from ..types import IWrapPackage, Uri, UriPackage, UriPackageOrWrapper, UriWrapper, Wrapper
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
