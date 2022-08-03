from dataclasses import dataclass
from . import ResolveUriErrorType


@dataclass
class ResolveUriError:
    type: ResolveUriErrorType
    error: Exception = None
