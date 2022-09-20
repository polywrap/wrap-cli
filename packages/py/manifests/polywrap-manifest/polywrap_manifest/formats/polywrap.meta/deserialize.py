# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `deserialize.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    MetaManifest,
    AnyMetaManifest,
    migrateMetaManifest,
    validateMetaManifest,
    latestMetaManifestFormat,
)
from ...deserialize import DeserializeManifestOptions
import json
from typing import cast, Optional
from packaging import version
import yaml


def deserializeMetaManifest(manifest: str, options: Optional[DeserializeManifestOptions]) -> MetaManifest:
    try:
        anyMetaManifest: Optional[AnyMetaManifest] = json.loads(manifest)
    except:
        anyMetaManifest: Optional[AnyMetaManifest] = yaml.safe_load(manifest)

    if anyMetaManifest is None:
        raise ValueError(f'Unable to parse MetaManifest: {manifest}')

    if options is None or not options.no_validate:
        validateMetaManifest(anyMetaManifest, getattr(options, 'ext_schema', None))

    anyMetaManifest.__type = 'MetaManifest'

    manifest_version = version.parse(anyMetaManifest.format)
    latest_version = version.parse(latestMetaManifestFormat)

    if manifest_version < latest_version:  # upgrade
        return migrateMetaManifest(anyMetaManifest, latestMetaManifestFormat)
    elif manifest_version > latest_version:  # downgrade
        raise ValueError(f'Cannot downgrade Polywrap version {anyMetaManifest.format}, please upgrade your PolywrapClient.')
    else:  # latest
        return cast(anyMetaManifest, MetaManifest)
