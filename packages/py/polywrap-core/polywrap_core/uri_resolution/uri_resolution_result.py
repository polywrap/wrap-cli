from typing import List, Optional

from result import Err, Ok, Result

from ..types import IUriResolutionStep, IWasmPackage, Uri, UriPackage, UriPackageOrWrapper, UriWrapper, Wrapper


class UriResolutionResult:
    result: Result[UriPackageOrWrapper, Exception]
    history: Optional[List[IUriResolutionStep]]

    @staticmethod
    def ok(
        uri: Uri, package: Optional[IWasmPackage] = None, wrapper: Optional[Wrapper] = None
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
