# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `migrate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyDeployManifest,
    DeployManifest,
    DeployManifestFormats,
    latestDeployManifestFormat
)
from typing import cast, Callable, Dict

migrators: Dict[DeployManifestFormats, Callable[[AnyDeployManifest], DeployManifest]] = {
}


def migrateDeployManifest(manifest: AnyDeployManifest, to: DeployManifestFormats) -> DeployManifest:
    try:
        old = DeployManifestFormats('manifest.format')
        if old == latestDeployManifestFormat:
            return cast(manifest, DeployManifest)
    except ValueError as ve:
        raise ValueError(f'Unrecognized DeployManifestFormat "{manifest.format}"') from ve

    raise LookupError(f'This should never happen, DeployManifest migrators is empty. from: {old}, to: {to}')
