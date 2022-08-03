# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `__init__.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from enum import Enum, unique
from typing import TypeAlias, Union, final
from formats import import_manifest
from migrate import migrateDeployManifest
from deserialize import deserializeDeployManifest
from validate import validateDeployManifest

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1','py.src.core.manifest.formats.polywrap.migrators')
DeployManifest0_0_1_prealpha_1: TypeAlias = __0_0_1_prealpha_1.DeployManifest


@final
@unique
class DeployManifestFormats(Enum):
    _0_0_1_prealpha_1 = '0.0.1-prealpha.1'


AnyDeployManifest: TypeAlias = Union[
    DeployManifest0_0_1_prealpha_1,
]
DeployManifest: TypeAlias = DeployManifest0_0_1_prealpha_1
latestDeployManifestFormat = DeployManifestFormats('0.0.1-prealpha.1')

__all__ = [
    'DeployManifest0_0_1_prealpha_1',
    'DeployManifestFormats',
    'AnyDeployManifest',
    'DeployManifest',
    'latestDeployManifestFormat',
    'migrateDeployManifest',
    'deserializeDeployManifest',
    'validateDeployManifest',
]
