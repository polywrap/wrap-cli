from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional

from result import Result

from .uri import Uri

if TYPE_CHECKING:
    from .uri_package_wrapper import UriPackageOrWrapper


@dataclass(slots=True, kw_only=True)
class IUriResolutionStep:
    source_uri: Uri
    result: Result["UriPackageOrWrapper", Exception]
    description: Optional[str] = None
    sub_history: Optional["IUriResolutionStep"] = None