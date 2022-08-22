from __future__ import annotations
from dataclasses import dataclass


@dataclass
class IpfsPluginConfig:
    provider: str
    fallback_providers: List[str] = None

@dataclass
class IpfsPluginConfigs(IpfsPluginConfig):
    pass
