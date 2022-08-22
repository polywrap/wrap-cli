from __future__ import annotations
from dataclasses import dataclass

@dataclass
class IpfsPluginConfig:
    provider: str
    fallback_providers: List[str] = None

def ipfs_plugin(opts: IpfsPluginConfig):
    return None
