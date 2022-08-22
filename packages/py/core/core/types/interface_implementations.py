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

    def __eq__(self, other: InterfaceImplementations) -> bool:
        return self.interface == other.interface and all(x in other.implementations for x in self.implementations)
