# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `migrate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyBuildManifest,
    BuildManifest,
    BuildManifestFormats,
    latestBuildManifestFormat
)
from typing import cast, Callable, Dict

migrators: Dict[BuildManifestFormats, Callable[[AnyBuildManifest], BuildManifest]] = {
}


def migrateBuildManifest(manifest: AnyBuildManifest, to: BuildManifestFormats) -> BuildManifest:
    try:
        old = BuildManifestFormats('manifest.format')
        if old == latestBuildManifestFormat:
            return cast(manifest, BuildManifest)
    except ValueError as ve:
        raise ValueError(f'Unrecognized BuildManifestFormat "{manifest.format}"') from ve

    raise LookupError(f'This should never happen, BuildManifest migrators is empty. from: {old}, to: {to}')
