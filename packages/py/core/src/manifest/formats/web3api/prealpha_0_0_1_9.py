from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class Web3ApiManifest:
    name: str
    language: str
    schema: str
    format: str = "0.0.1-prealpha.9"
    build: str = ""
    meta: str = ""
    deploy: str = ""
    main: str = ""
    import_redirects: List[Dict[str, str]] = field(default_factory=list)
    __type: str = "Web3ApiManifest"
