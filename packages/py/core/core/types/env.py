from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict

from . import Uri


@dataclass(slots=True, kw_only=True)
class Env:
    """
    this type can be used to set env for a wrapper in the client

    Args:
        uri: Uri of wrapper
        env: env variables used by the module
    """

    uri: Uri
    env: Dict[str, Any] = field(default_factory=dict)
