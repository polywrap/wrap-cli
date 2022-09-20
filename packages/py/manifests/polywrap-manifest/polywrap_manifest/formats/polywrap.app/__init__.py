# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `__init__.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from enum import Enum, unique
from typing import TypeAlias, Union, final
from formats import import_manifest
from migrate import migrateAppManifest
from deserialize import deserializeAppManifest
from validate import validateAppManifest

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1','py.src.core.manifest.formats.polywrap.migrators')
AppManifest0_0_1_prealpha_1: TypeAlias = __0_0_1_prealpha_1.AppManifest
__0_0_1_prealpha_2 = import_manifest('0.0.1-prealpha.2','py.src.core.manifest.formats.polywrap.migrators')
AppManifest0_0_1_prealpha_2: TypeAlias = __0_0_1_prealpha_2.AppManifest


@final
@unique
class AppManifestFormats(Enum):
    _0_0_1_prealpha_1 = '0.0.1-prealpha.1'
    _0_0_1_prealpha_2 = '0.0.1-prealpha.2'


AnyAppManifest: TypeAlias = Union[
    AppManifest0_0_1_prealpha_1,
    AppManifest0_0_1_prealpha_2,
]
AppManifest: TypeAlias = AppManifest0_0_1_prealpha_2
latestAppManifestFormat = AppManifestFormats('0.0.1-prealpha.2')

__all__ = [
    'AppManifest0_0_1_prealpha_1',
    'AppManifest0_0_1_prealpha_2',
    'AppManifestFormats',
    'AnyAppManifest',
    'AppManifest',
    'latestAppManifestFormat',
    'migrateAppManifest',
    'deserializeAppManifest',
    'validateAppManifest',
]
