from __future__ import annotations
from dataclasses import dataclass
from typing import Union


@dataclass
class CreateApiFunc:
    uri: Uri
    manifest: Web3ApiManifest
    uri_resolver: str  # name or URI
    environment: Union[Env, None]
