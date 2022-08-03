from dataclasses import dataclass

from ....types.uri import Uri


@dataclass
class UriResult:
    uri: Uri
    api: bool


@dataclass
class UriResolutionInfo:
    uri_resolver: str
    source_uri: Uri
    result: UriResult
