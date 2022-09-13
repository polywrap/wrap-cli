from __future__ import annotations
from dataclasses import dataclass


@dataclass
class EthereumConfig:
    networks: ConnectionConfigs
    default_network: str = None


@dataclass
class EthereumPluginConfig(EthereumConfig):
    pass


@dataclass
class ConnectionConfig:
    provider: EthereumProvider
    signer: EthereumSigner = None


@dataclass
class ConnectionConfigs:
    network: ConnectionConfig

