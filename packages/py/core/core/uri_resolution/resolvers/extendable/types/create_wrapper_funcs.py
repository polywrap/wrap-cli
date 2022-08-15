from __future__ import annotations
from dataclasses import dataclass
from typing import Union

from .....types import Uri, Env

@dataclass
class CreateWrapperFunc:
    uri: Uri
    manifest: WrapManifest
    uri_resolver: str  # name or URI
    environment: Union[Env, None]
