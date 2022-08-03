from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, Any, List


@dataclass
class Env:
    uri: Uri
    """uri of a Web3Api"""
    module: Dict[str, Any] = field(default_factory=dict)
    """env variables shared by both mutation and query"""


def sanitize_envs(environments: List[Env]) -> List[Env]:
    output = []
    for env in environments:
        output.append(Env(uri=Uri(env.uri), module=env.module))

    return output
