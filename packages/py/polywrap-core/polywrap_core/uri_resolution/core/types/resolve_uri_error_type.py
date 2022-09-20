from __future__ import annotations

from enum import Enum


class ResolveUriErrorType(Enum):
    InfiniteLoop = 0
    InternalResolver = 1
