# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `deserialize.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    InfraManifest,
    AnyInfraManifest,
    migrateInfraManifest,
    validateInfraManifest,
    latestInfraManifestFormat,
)
from ...deserialize import DeserializeManifestOptions
import json
from typing import cast, Optional
from packaging import version
import yaml


def deserializeInfraManifest(manifest: str, options: Optional[DeserializeManifestOptions]) -> InfraManifest:
    try:
        anyInfraManifest: Optional[AnyInfraManifest] = json.loads(manifest)
    except:
        anyInfraManifest: Optional[AnyInfraManifest] = yaml.safe_load(manifest)

    if anyInfraManifest is None:
        raise ValueError(f'Unable to parse InfraManifest: {manifest}')

    if options is None or not options.no_validate:
        validateInfraManifest(anyInfraManifest, getattr(options, 'ext_schema', None))

    anyInfraManifest.__type = 'InfraManifest'

    manifest_version = version.parse(anyInfraManifest.format)
    latest_version = version.parse(latestInfraManifestFormat)

    if manifest_version < latest_version:  # upgrade
        return migrateInfraManifest(anyInfraManifest, latestInfraManifestFormat)
    elif manifest_version > latest_version:  # downgrade
        raise ValueError(f'Cannot downgrade Polywrap version {anyInfraManifest.format}, please upgrade your PolywrapClient.')
    else:  # latest
        return cast(anyInfraManifest, InfraManifest)
