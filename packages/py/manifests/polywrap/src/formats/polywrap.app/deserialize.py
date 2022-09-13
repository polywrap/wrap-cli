# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `deserialize.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AppManifest,
    AnyAppManifest,
    migrateAppManifest,
    validateAppManifest,
    latestAppManifestFormat,
)
from ...deserialize import DeserializeManifestOptions
import json
from typing import cast, Optional
from packaging import version
import yaml


def deserializeAppManifest(manifest: str, options: Optional[DeserializeManifestOptions]) -> AppManifest:
    try:
        anyAppManifest: Optional[AnyAppManifest] = json.loads(manifest)
    except:
        anyAppManifest: Optional[AnyAppManifest] = yaml.safe_load(manifest)

    if anyAppManifest is None:
        raise ValueError(f'Unable to parse AppManifest: {manifest}')

    if options is None or not options.no_validate:
        validateAppManifest(anyAppManifest, getattr(options, 'ext_schema', None))

    anyAppManifest.__type = 'AppManifest'

    manifest_version = version.parse(anyAppManifest.format)
    latest_version = version.parse(latestAppManifestFormat)

    if manifest_version < latest_version:  # upgrade
        return migrateAppManifest(anyAppManifest, latestAppManifestFormat)
    elif manifest_version > latest_version:  # downgrade
        raise ValueError(f'Cannot downgrade Polywrap version {anyAppManifest.format}, please upgrade your PolywrapClient.')
    else:  # latest
        return cast(anyAppManifest, AppManifest)
