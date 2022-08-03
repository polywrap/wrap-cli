from __future__ import annotations
from .prealpha_0_0_1_9 import Web3ApiManifest


def deserialize_web3_api_manifest(manifest: str, options: DeserializeManifestOptions = None) -> Web3ApiManifest:
    # TODO: POL-28
    return Web3ApiManifest(name=None, language=None, schema=None)
