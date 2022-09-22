from dataclasses import dataclass
from typing import Optional

from result import Result

from ..types import Uri, UriPackageOrWrapper


@dataclass(slots=True, kw_only=True)
class UriResolutionStep:
    source_uri: Uri
    result: Result[UriPackageOrWrapper, Exception]
    description: Optional[str] = None
    sub_history: Optional["UriResolutionStep"] = None
