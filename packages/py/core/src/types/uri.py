from __future__ import annotations
import re
from dataclasses import dataclass
from typing import Any, Union


@dataclass
class UriConfig:
    """URI configuration."""

    authority: str
    path: str
    uri: str


class Uri:
    """
    A Web3API URI.

    Some examples of valid URIs are:
        w3://ipfs/QmHASH
        w3://ens/sub.dimain.eth
        w3://fs/directory/file.txt
        w3://uns/domain.crypto
    Breaking down the various parts of the URI, as it applies
    to [the URI standard](https://tools.ietf.org/html/rfc3986#section-3):
    **w3://** - URI Scheme: differentiates Web3API URIs.
    **ipfs/** - URI Authority: allows the Web3API URI resolution algorithm to determine an authoritative URI resolver.
    **sub.domain.eth** - URI Path: tells the Authority where the API resides.
    """

    def __init__(self, uri: str):
        self._config = Uri.parse_uri(uri)

    def __str__(self) -> str:
        return self._config.uri

    def __eq__(self, b: Uri) -> bool:
        return self.uri == b.uri

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
    def is_valid_uri(uri: str, parsed: UriConfig = None) -> Union[UriConfig, bool]:
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
        w3_scheme_idx = processed.find("w3://")
        if w3_scheme_idx == -1:
            processed = "w3://" + processed

        # If the w3:// is not in the beginning, throw an error
        if w3_scheme_idx > -1 and w3_scheme_idx != 0:
            raise ValueError("The w3:// scheme must be at the beginning of the URI string")

        # Extract the authoriy & path
        result = re.findall(r"(w3:\/\/([a-z][a-z0-9-_]+)\/(.*))", processed)

        # Remove all empty strings
        if result:
            result = list(filter(lambda x: x != " " and x != "", result[0]))

        if not result or len(result) != 3:
            raise ValueError(
                f"""URI is malformed, here are some examples of valid URIs:\n
                w3://ipfs/QmHASH\n
                w3://ens/domain.eth\n
                ens/domain.eth\n\n
                Invalid URI Received: {uri}
                """
            )

        return UriConfig(uri=processed, authority=result[1], path=result[2])
