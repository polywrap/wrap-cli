# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `migrate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyAppManifest,
    AppManifest,
    AppManifestFormats,
    latestAppManifestFormat
)
from typing import cast, Callable, Dict

migrators: Dict[AppManifestFormats, Callable[[AnyAppManifest], AppManifest]] = {
}


def migrateAppManifest(manifest: AnyAppManifest, to: AppManifestFormats) -> AppManifest:
    try:
        old = AppManifestFormats('manifest.format')
        if old == latestAppManifestFormat:
            return cast(manifest, AppManifest)
    except ValueError as ve:
        raise ValueError(f'Unrecognized AppManifestFormat "{manifest.format}"') from ve

    raise LookupError(f'This should never happen, AppManifest migrators is empty. from: {old}, to: {to}')
