# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `migrate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyPolywrapManifest,
    PolywrapManifest,
    PolywrapManifestFormats,
    latestPolywrapManifestFormat
)
from typing import cast, Callable, Dict

migrators: Dict[PolywrapManifestFormats, Callable[[AnyPolywrapManifest], PolywrapManifest]] = {
}


def migratePolywrapManifest(manifest: AnyPolywrapManifest, to: PolywrapManifestFormats) -> PolywrapManifest:
    try:
        old = PolywrapManifestFormats('manifest.format')
        if old == latestPolywrapManifestFormat:
            return cast(manifest, PolywrapManifest)
    except ValueError as ve:
        raise ValueError(f'Unrecognized PolywrapManifestFormat "{manifest.format}"') from ve

    raise LookupError(f'This should never happen, PolywrapManifest migrators is empty. from: {old}, to: {to}')
