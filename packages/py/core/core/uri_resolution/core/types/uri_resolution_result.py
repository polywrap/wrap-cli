from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from ....types import Uri, Wrapper


@dataclass
class UriResolutionResult:
    uri: Uri
    wrapper: Optional[Wrapper] = None
    error: Optional[Exception] = None
