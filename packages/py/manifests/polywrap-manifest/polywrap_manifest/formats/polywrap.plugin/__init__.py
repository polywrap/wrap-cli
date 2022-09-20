# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `__init__.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from enum import Enum, unique
from typing import TypeAlias, Union, final
from formats import import_manifest
from migrate import migratePluginManifest
from deserialize import deserializePluginManifest
from validate import validatePluginManifest

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1','py.src.core.manifest.formats.polywrap.migrators')
PluginManifest0_0_1_prealpha_1: TypeAlias = __0_0_1_prealpha_1.PluginManifest
__0_0_1_prealpha_2 = import_manifest('0.0.1-prealpha.2','py.src.core.manifest.formats.polywrap.migrators')
PluginManifest0_0_1_prealpha_2: TypeAlias = __0_0_1_prealpha_2.PluginManifest
__0_0_1_prealpha_3 = import_manifest('0.0.1-prealpha.3','py.src.core.manifest.formats.polywrap.migrators')
PluginManifest0_0_1_prealpha_3: TypeAlias = __0_0_1_prealpha_3.PluginManifest


@final
@unique
class PluginManifestFormats(Enum):
    _0_0_1_prealpha_1 = '0.0.1-prealpha.1'
    _0_0_1_prealpha_2 = '0.0.1-prealpha.2'
    _0_0_1_prealpha_3 = '0.0.1-prealpha.3'


AnyPluginManifest: TypeAlias = Union[
    PluginManifest0_0_1_prealpha_1,
    PluginManifest0_0_1_prealpha_2,
    PluginManifest0_0_1_prealpha_3,
]
PluginManifest: TypeAlias = PluginManifest0_0_1_prealpha_3
latestPluginManifestFormat = PluginManifestFormats('0.0.1-prealpha.3')

__all__ = [
    'PluginManifest0_0_1_prealpha_1',
    'PluginManifest0_0_1_prealpha_2',
    'PluginManifest0_0_1_prealpha_3',
    'PluginManifestFormats',
    'AnyPluginManifest',
    'PluginManifest',
    'latestPluginManifestFormat',
    'migratePluginManifest',
    'deserializePluginManifest',
    'validatePluginManifest',
]
