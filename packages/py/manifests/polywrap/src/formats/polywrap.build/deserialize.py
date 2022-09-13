# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `deserialize.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    BuildManifest,
    AnyBuildManifest,
    migrateBuildManifest,
    validateBuildManifest,
    latestBuildManifestFormat,
)
from ...deserialize import DeserializeManifestOptions
import json
from typing import cast, Optional
from packaging import version
import yaml


def deserializeBuildManifest(manifest: str, options: Optional[DeserializeManifestOptions]) -> BuildManifest:
    try:
        anyBuildManifest: Optional[AnyBuildManifest] = json.loads(manifest)
    except:
        anyBuildManifest: Optional[AnyBuildManifest] = yaml.safe_load(manifest)

    if anyBuildManifest is None:
        raise ValueError(f'Unable to parse BuildManifest: {manifest}')

    if options is None or not options.no_validate:
        validateBuildManifest(anyBuildManifest, getattr(options, 'ext_schema', None))

    anyBuildManifest.__type = 'BuildManifest'

    manifest_version = version.parse(anyBuildManifest.format)
    latest_version = version.parse(latestBuildManifestFormat)

    if manifest_version < latest_version:  # upgrade
        return migrateBuildManifest(anyBuildManifest, latestBuildManifestFormat)
    elif manifest_version > latest_version:  # downgrade
        raise ValueError(f'Cannot downgrade Polywrap version {anyBuildManifest.format}, please upgrade your PolywrapClient.')
    else:  # latest
        return cast(anyBuildManifest, BuildManifest)
