# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `deserialize.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    PolywrapManifest,
    AnyPolywrapManifest,
    migratePolywrapManifest,
    validatePolywrapManifest,
    latestPolywrapManifestFormat,
)
from ...deserialize import DeserializeManifestOptions
import json
from typing import cast, Optional
from packaging import version
import yaml


def deserializePolywrapManifest(manifest: str, options: Optional[DeserializeManifestOptions]) -> PolywrapManifest:
    try:
        anyPolywrapManifest: Optional[AnyPolywrapManifest] = json.loads(manifest)
    except:
        anyPolywrapManifest: Optional[AnyPolywrapManifest] = yaml.safe_load(manifest)

    if anyPolywrapManifest is None:
        raise ValueError(f'Unable to parse PolywrapManifest: {manifest}')

    if options is None or not options.no_validate:
        validatePolywrapManifest(anyPolywrapManifest, getattr(options, 'ext_schema', None))

    anyPolywrapManifest.__type = 'PolywrapManifest'

    manifest_version = version.parse(anyPolywrapManifest.format)
    latest_version = version.parse(latestPolywrapManifestFormat)

    if manifest_version < latest_version:  # upgrade
        return migratePolywrapManifest(anyPolywrapManifest, latestPolywrapManifestFormat)
    elif manifest_version > latest_version:  # downgrade
        raise ValueError(f'Cannot downgrade Polywrap version {anyPolywrapManifest.format}, please upgrade your PolywrapClient.')
    else:  # latest
        return cast(anyPolywrapManifest, PolywrapManifest)
