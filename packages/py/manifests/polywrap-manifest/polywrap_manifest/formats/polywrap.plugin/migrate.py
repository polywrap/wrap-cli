# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `migrate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyPluginManifest,
    PluginManifest,
    PluginManifestFormats,
    latestPluginManifestFormat
)
from typing import cast, Callable, Dict

migrators: Dict[PluginManifestFormats, Callable[[AnyPluginManifest], PluginManifest]] = {
}


def migratePluginManifest(manifest: AnyPluginManifest, to: PluginManifestFormats) -> PluginManifest:
    try:
        old = PluginManifestFormats('manifest.format')
        if old == latestPluginManifestFormat:
            return cast(manifest, PluginManifest)
    except ValueError as ve:
        raise ValueError(f'Unrecognized PluginManifestFormat "{manifest.format}"') from ve

    raise LookupError(f'This should never happen, PluginManifest migrators is empty. from: {old}, to: {to}')
