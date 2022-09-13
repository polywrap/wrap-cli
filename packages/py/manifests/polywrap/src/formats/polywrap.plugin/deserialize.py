# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `deserialize.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    PluginManifest,
    AnyPluginManifest,
    migratePluginManifest,
    validatePluginManifest,
    latestPluginManifestFormat,
)
from ...deserialize import DeserializeManifestOptions
import json
from typing import cast, Optional
from packaging import version
import yaml


def deserializePluginManifest(manifest: str, options: Optional[DeserializeManifestOptions]) -> PluginManifest:
    try:
        anyPluginManifest: Optional[AnyPluginManifest] = json.loads(manifest)
    except:
        anyPluginManifest: Optional[AnyPluginManifest] = yaml.safe_load(manifest)

    if anyPluginManifest is None:
        raise ValueError(f'Unable to parse PluginManifest: {manifest}')

    if options is None or not options.no_validate:
        validatePluginManifest(anyPluginManifest, getattr(options, 'ext_schema', None))

    anyPluginManifest.__type = 'PluginManifest'

    manifest_version = version.parse(anyPluginManifest.format)
    latest_version = version.parse(latestPluginManifestFormat)

    if manifest_version < latest_version:  # upgrade
        return migratePluginManifest(anyPluginManifest, latestPluginManifestFormat)
    elif manifest_version > latest_version:  # downgrade
        raise ValueError(f'Cannot downgrade Polywrap version {anyPluginManifest.format}, please upgrade your PolywrapClient.')
    else:  # latest
        return cast(anyPluginManifest, PluginManifest)
