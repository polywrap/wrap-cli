from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

from .uri import Uri


@dataclass(slots=True, kw_only=True)
class InterfaceImplementations:
    """
    this type can be used to register implementations for a particular interface in the client

    Args:
        interface: Uri of the interface wrapper
        implementations: list of uris of the implementation wrappers
    """

    interface: Uri
    implementations: List[Uri] = field(default_factory=list)
