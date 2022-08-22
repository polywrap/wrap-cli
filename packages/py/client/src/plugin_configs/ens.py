from __future__ import annotations
from dataclasses import dataclass


@dataclass
class EnsPluginConfigs:
    query: QueryConfig

@dataclass
class EnsPluginConfigs:
    addresses: Addresses = None

@dataclass
class Addresses:
    network: str = None
