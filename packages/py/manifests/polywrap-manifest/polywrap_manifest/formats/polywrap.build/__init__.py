# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `__init__.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from enum import Enum, unique
from typing import TypeAlias, Union, final
from formats import import_manifest
from migrate import migrateBuildManifest
from deserialize import deserializeBuildManifest
from validate import validateBuildManifest

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1','py.src.core.manifest.formats.polywrap.migrators')
BuildManifest0_0_1_prealpha_1: TypeAlias = __0_0_1_prealpha_1.BuildManifest
__0_0_1_prealpha_2 = import_manifest('0.0.1-prealpha.2','py.src.core.manifest.formats.polywrap.migrators')
BuildManifest0_0_1_prealpha_2: TypeAlias = __0_0_1_prealpha_2.BuildManifest
__0_0_1_prealpha_3 = import_manifest('0.0.1-prealpha.3','py.src.core.manifest.formats.polywrap.migrators')
BuildManifest0_0_1_prealpha_3: TypeAlias = __0_0_1_prealpha_3.BuildManifest


@final
@unique
class BuildManifestFormats(Enum):
    _0_0_1_prealpha_1 = '0.0.1-prealpha.1'
    _0_0_1_prealpha_2 = '0.0.1-prealpha.2'
    _0_0_1_prealpha_3 = '0.0.1-prealpha.3'


AnyBuildManifest: TypeAlias = Union[
    BuildManifest0_0_1_prealpha_1,
    BuildManifest0_0_1_prealpha_2,
    BuildManifest0_0_1_prealpha_3,
]
BuildManifest: TypeAlias = BuildManifest0_0_1_prealpha_3
latestBuildManifestFormat = BuildManifestFormats('0.0.1-prealpha.3')

__all__ = [
    'BuildManifest0_0_1_prealpha_1',
    'BuildManifest0_0_1_prealpha_2',
    'BuildManifest0_0_1_prealpha_3',
    'BuildManifestFormats',
    'AnyBuildManifest',
    'BuildManifest',
    'latestBuildManifestFormat',
    'migrateBuildManifest',
    'deserializeBuildManifest',
    'validateBuildManifest',
]
