from __future__ import annotations
from typing import List
from dataclasses import dataclass

from .uri import Uri


@dataclass
class InterfaceImplementations:
    interface: str
    implementations: List[str]


def sanitize_interface_implementations(input: List[InterfaceImplementations]) -> List[InterfaceImplementations]:
    output = []
    for definition in input:
        interface_uri = Uri(definition.interface)
        implementations = [Uri(x) if isinstance(x, str) else x for x in definition.implementations]
        output.append(InterfaceImplementations(interface=interface_uri, implementations=implementations))
    return output
