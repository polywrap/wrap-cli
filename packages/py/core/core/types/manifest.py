"""TODO: REMOVE THIS MODULE ONCE WE HAVE ACTUAL MANIFEST"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Any, Optional


class WrapManifestType(Enum):
    WASM = "wasm"
    INTERFACE = "interface"


@dataclass(slots=True, kw_only=True)
class WrapManifest:
    version: str
    type: WrapManifestType
    name: str
    abi: Any

AnyWrapManifest = WrapManifest


@dataclass(slots=True, kw_only=True)
class DeserializeManifestOptions:
    no_validate: bool = False
    ext_schema: Any = None

def deserialize_wrap_manifest(manifest: str, options: Optional[DeserializeManifestOptions] = None) -> WrapManifest:
    return WrapManifest(name="todo", version="0.1.0", type=WrapManifestType.WASM, abi=None)
