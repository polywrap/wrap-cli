from __future__ import annotations
from dataclasses import dataclass

from .ipfs import IpfsPluginConfig
from .ethereum import EthereumPluginConfig


@dataclass
class PluginConfigs():
    ipfs: IpfsPluginConfig = None
    ethereum: EthereumPluginConfig = None
    ens: EnsPluginConfig = None


modules = {
    "ipfs": "@polywrap/ipfs-plugin-js",
    "ethereum": "@polywrap/ethereum-plugin-js",
    "ens": "@polywrap/ens-plugin-js",
}

uris = {
    "ipfs": "wrap://ens/ipfs.polywrap.eth",
    "ethereum": "wrap://ens/ethereum.polywrap.eth",
    "ens": "wrap://ens/ens.polywrap.eth",
}
