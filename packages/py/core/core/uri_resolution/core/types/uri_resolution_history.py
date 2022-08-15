from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

from ....types import Uri
from . import UriResolutionStack


@dataclass(slots=True, kw_only=True)
class UriResolutionHistory:
    stack: UriResolutionStack
    uri_resolvers: List[str] = field(init=False)
    uris: List[Uri] = field(init=False)
    resolution_path: "UriResolutionHistory" = field(init=False)

    def __post_init__(self):
        self.uri_resolvers = [x.uri_resolver for x in self.stack]
        self.uris = list(set(x.result.uri for x in self.stack))
        self.resolution_path = UriResolutionHistory(
            [x for x in self.stack if x.source_uri.uri != x.result.uri.uri or x.result.api]
        )
