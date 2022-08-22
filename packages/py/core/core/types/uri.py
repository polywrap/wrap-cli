from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, List, Optional, Tuple, Union


@dataclass(slots=True, kw_only=True)
class UriConfig:
    """URI configuration."""

    authority: str
    path: str
    uri: str


class Uri:
    """
    A Polywrap URI.

    Some examples of valid URIs are:
        wrap://ipfs/QmHASH
        wrap://ens/sub.dimain.eth
        wrap://fs/directory/file.txt
        wrap://uns/domain.crypto
    Breaking down the various parts of the URI, as it applies
    to [the URI standard](https://tools.ietf.org/html/rfc3986#section-3):
    **wrap://** - URI Scheme: differentiates Polywrap URIs.
    **ipfs/** - URI Authority: allows the Polywrap URI resolution algorithm to determine an authoritative URI resolver.
    **sub.domain.eth** - URI Path: tells the Authority where the API resides.
    """

    def __init__(self, uri: str):
        self._config = Uri.parse_uri(uri)

    def __str__(self) -> str:
        return self._config.uri

    def __eq__(self, b: Uri) -> bool:
        return self.uri == b.uri

    def __lt__(self, b: Uri) -> bool:
        return self.uri < b.uri

    @property
    def authority(self) -> str:
        return self._config.authority

    @property
    def path(self) -> str:
        return self._config.path

    @property
    def uri(self) -> str:
        return self._config.uri

    @staticmethod
    def equals(a: Uri, b: Uri) -> bool:
        return a.uri == b.uri

    @staticmethod
    def is_uri(value: Any) -> bool:
        return hasattr(value, 'uri')

    @staticmethod
    def is_valid_uri(uri: str, parsed: Optional[UriConfig] = None) -> Tuple[Union[UriConfig, None], bool]:
        try:
            result = Uri.parse_uri(uri)
            return result, True
        except Exception:
            return parsed, False

    @staticmethod
    def parse_uri(uri: str) -> UriConfig:
        if not uri:
            raise ValueError("The provided URI is empty")

        processed = uri

        # Trim preceding '/' characters
        processed = processed.lstrip('/')
        # Check for the w3:// scheme, add if it isn't there
        wrap_scheme_idx = processed.find("wrap://")
        if wrap_scheme_idx == -1:
            processed = "wrap://" + processed

        # If the w3:// is not in the beginning, throw an error
        if wrap_scheme_idx > -1 and wrap_scheme_idx != 0:
            raise ValueError("The wrap:// scheme must be at the beginning of the URI string")

        # Extract the authoriy & path
        result: List[str] = re.findall(r"(wrap:\/\/([a-z][a-z0-9-_]+)\/(.*))", processed)

        # Remove all empty strings
        if result:
            result = list(filter(lambda x: x != " " and x != "", result[0]))

        if not result or len(result) != 3:
            raise ValueError(
                f"""URI is malformed, here are some examples of valid URIs:\n
                wrap://ipfs/QmHASH\n
                wrap://ens/domain.eth\n
                ens/domain.eth\n\n
                Invalid URI Received: {uri}
                """
            )

        return UriConfig(uri=processed, authority=result[1], path=result[2])
