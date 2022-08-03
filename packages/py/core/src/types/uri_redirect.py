from __future__ import annotations
from dataclasses import dataclass
from typing import List

from . import Uri


@dataclass
class UriRedirect:
    from_uri: Uri
    to_uri: Uri


def sanitize_uri_redirects(input: List[UriRedirect]) -> List[UriRedirect]:
    output = []
    for definition in input:
        from_uri = Uri(definition.from_uri)
        to_uri = Uri(definition.to_uri) if isinstance(definition.to_uri, str) else definition.to_uri
        output.append(UriRedirect(from_uri=from_uri, to_uri=to_uri))

    return output
