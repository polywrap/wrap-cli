# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `migrate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyInfraManifest,
    InfraManifest,
    InfraManifestFormats,
    latestInfraManifestFormat
)
from typing import cast, Callable, Dict

migrators: Dict[InfraManifestFormats, Callable[[AnyInfraManifest], InfraManifest]] = {
}


def migrateInfraManifest(manifest: AnyInfraManifest, to: InfraManifestFormats) -> InfraManifest:
    try:
        old = InfraManifestFormats('manifest.format')
        if old == latestInfraManifestFormat:
            return cast(manifest, InfraManifest)
    except ValueError as ve:
        raise ValueError(f'Unrecognized InfraManifestFormat "{manifest.format}"') from ve

    raise LookupError(f'This should never happen, InfraManifest migrators is empty. from: {old}, to: {to}')
