# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `migrate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyMetaManifest,
    MetaManifest,
    MetaManifestFormats,
    latestMetaManifestFormat
)
from typing import cast, Callable, Dict

migrators: Dict[MetaManifestFormats, Callable[[AnyMetaManifest], MetaManifest]] = {
}


def migrateMetaManifest(manifest: AnyMetaManifest, to: MetaManifestFormats) -> MetaManifest:
    try:
        old = MetaManifestFormats('manifest.format')
        if old == latestMetaManifestFormat:
            return cast(manifest, MetaManifest)
    except ValueError as ve:
        raise ValueError(f'Unrecognized MetaManifestFormat "{manifest.format}"') from ve

    raise LookupError(f'This should never happen, MetaManifest migrators is empty. from: {old}, to: {to}')
