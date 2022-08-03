# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `__init__.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from enum import Enum, unique
from typing import TypeAlias, Union, final
from formats import import_manifest
from migrate import migrateInfraManifest
from deserialize import deserializeInfraManifest
from validate import validateInfraManifest

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1','py.src.core.manifest.formats.polywrap.migrators')
InfraManifest0_0_1_prealpha_1: TypeAlias = __0_0_1_prealpha_1.InfraManifest
__0_0_1_prealpha_2 = import_manifest('0.0.1-prealpha.2','py.src.core.manifest.formats.polywrap.migrators')
InfraManifest0_0_1_prealpha_2: TypeAlias = __0_0_1_prealpha_2.InfraManifest


@final
@unique
class InfraManifestFormats(Enum):
    _0_0_1_prealpha_1 = '0.0.1-prealpha.1'
    _0_0_1_prealpha_2 = '0.0.1-prealpha.2'


AnyInfraManifest: TypeAlias = Union[
    InfraManifest0_0_1_prealpha_1,
    InfraManifest0_0_1_prealpha_2,
]
InfraManifest: TypeAlias = InfraManifest0_0_1_prealpha_2
latestInfraManifestFormat = InfraManifestFormats('0.0.1-prealpha.2')

__all__ = [
    'InfraManifest0_0_1_prealpha_1',
    'InfraManifest0_0_1_prealpha_2',
    'InfraManifestFormats',
    'AnyInfraManifest',
    'InfraManifest',
    'latestInfraManifestFormat',
    'migrateInfraManifest',
    'deserializeInfraManifest',
    'validateInfraManifest',
]
