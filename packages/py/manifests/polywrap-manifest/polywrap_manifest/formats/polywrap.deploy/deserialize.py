# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `deserialize.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    DeployManifest,
    AnyDeployManifest,
    migrateDeployManifest,
    validateDeployManifest,
    latestDeployManifestFormat,
)
from ...deserialize import DeserializeManifestOptions
import json
from typing import cast, Optional
from packaging import version
import yaml


def deserializeDeployManifest(manifest: str, options: Optional[DeserializeManifestOptions]) -> DeployManifest:
    try:
        anyDeployManifest: Optional[AnyDeployManifest] = json.loads(manifest)
    except:
        anyDeployManifest: Optional[AnyDeployManifest] = yaml.safe_load(manifest)

    if anyDeployManifest is None:
        raise ValueError(f'Unable to parse DeployManifest: {manifest}')

    if options is None or not options.no_validate:
        validateDeployManifest(anyDeployManifest, getattr(options, 'ext_schema', None))

    anyDeployManifest.__type = 'DeployManifest'

    manifest_version = version.parse(anyDeployManifest.format)
    latest_version = version.parse(latestDeployManifestFormat)

    if manifest_version < latest_version:  # upgrade
        return migrateDeployManifest(anyDeployManifest, latestDeployManifestFormat)
    elif manifest_version > latest_version:  # downgrade
        raise ValueError(f'Cannot downgrade Polywrap version {anyDeployManifest.format}, please upgrade your PolywrapClient.')
    else:  # latest
        return cast(anyDeployManifest, DeployManifest)
