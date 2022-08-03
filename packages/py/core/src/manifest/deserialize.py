from __future__ import annotations
from dataclasses import dataclass


@dataclass
class DeserializeManifestOptions:
    no_validate: boolean = False
    ext_schema: JsonSchema = None
