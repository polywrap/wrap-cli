from typing import List


class UriResolutionHistory:
    def __init__(self, stack: "UriResolutionStack"):
        self.stack = stack

    @property
    def uri_resolvers(self) -> List[str]:
        return [x.uri_resolver for x in self.stack]

    @property
    def uris(self) -> List["Uri"]:
        return list(set(x.result.uri for x in self.stack))

    def get_resolution_path(self) -> "UriResolutionHistory":
        path = UriResolutionHistory([x for x in self.stack if x.source_uri.uri != x.result.uri.uri or x.result.api])
        return path
