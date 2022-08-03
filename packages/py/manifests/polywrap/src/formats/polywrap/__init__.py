# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `__init__.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from enum import Enum, unique
from typing import TypeAlias, Union, final
from formats import import_manifest
from migrate import migratePolywrapManifest
from deserialize import deserializePolywrapManifest
from validate import validatePolywrapManifest

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_1: TypeAlias = __0_0_1_prealpha_1.PolywrapManifest
__0_0_1_prealpha_2 = import_manifest('0.0.1-prealpha.2','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_2: TypeAlias = __0_0_1_prealpha_2.PolywrapManifest
__0_0_1_prealpha_3 = import_manifest('0.0.1-prealpha.3','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_3: TypeAlias = __0_0_1_prealpha_3.PolywrapManifest
__0_0_1_prealpha_4 = import_manifest('0.0.1-prealpha.4','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_4: TypeAlias = __0_0_1_prealpha_4.PolywrapManifest
__0_0_1_prealpha_5 = import_manifest('0.0.1-prealpha.5','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_5: TypeAlias = __0_0_1_prealpha_5.PolywrapManifest
__0_0_1_prealpha_6 = import_manifest('0.0.1-prealpha.6','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_6: TypeAlias = __0_0_1_prealpha_6.PolywrapManifest
__0_0_1_prealpha_7 = import_manifest('0.0.1-prealpha.7','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_7: TypeAlias = __0_0_1_prealpha_7.PolywrapManifest
__0_0_1_prealpha_8 = import_manifest('0.0.1-prealpha.8','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_8: TypeAlias = __0_0_1_prealpha_8.PolywrapManifest
__0_0_1_prealpha_9 = import_manifest('0.0.1-prealpha.9','py.src.core.manifest.formats.polywrap.migrators')
PolywrapManifest0_0_1_prealpha_9: TypeAlias = __0_0_1_prealpha_9.PolywrapManifest


@final
@unique
class PolywrapManifestFormats(Enum):
    _0_0_1_prealpha_1 = '0.0.1-prealpha.1'
    _0_0_1_prealpha_2 = '0.0.1-prealpha.2'
    _0_0_1_prealpha_3 = '0.0.1-prealpha.3'
    _0_0_1_prealpha_4 = '0.0.1-prealpha.4'
    _0_0_1_prealpha_5 = '0.0.1-prealpha.5'
    _0_0_1_prealpha_6 = '0.0.1-prealpha.6'
    _0_0_1_prealpha_7 = '0.0.1-prealpha.7'
    _0_0_1_prealpha_8 = '0.0.1-prealpha.8'
    _0_0_1_prealpha_9 = '0.0.1-prealpha.9'


AnyPolywrapManifest: TypeAlias = Union[
    PolywrapManifest0_0_1_prealpha_1,
    PolywrapManifest0_0_1_prealpha_2,
    PolywrapManifest0_0_1_prealpha_3,
    PolywrapManifest0_0_1_prealpha_4,
    PolywrapManifest0_0_1_prealpha_5,
    PolywrapManifest0_0_1_prealpha_6,
    PolywrapManifest0_0_1_prealpha_7,
    PolywrapManifest0_0_1_prealpha_8,
    PolywrapManifest0_0_1_prealpha_9,
]
PolywrapManifest: TypeAlias = PolywrapManifest0_0_1_prealpha_9
latestPolywrapManifestFormat = PolywrapManifestFormats('0.0.1-prealpha.9')

__all__ = [
    'PolywrapManifest0_0_1_prealpha_1',
    'PolywrapManifest0_0_1_prealpha_2',
    'PolywrapManifest0_0_1_prealpha_3',
    'PolywrapManifest0_0_1_prealpha_4',
    'PolywrapManifest0_0_1_prealpha_5',
    'PolywrapManifest0_0_1_prealpha_6',
    'PolywrapManifest0_0_1_prealpha_7',
    'PolywrapManifest0_0_1_prealpha_8',
    'PolywrapManifest0_0_1_prealpha_9',
    'PolywrapManifestFormats',
    'AnyPolywrapManifest',
    'PolywrapManifest',
    'latestPolywrapManifestFormat',
    'migratePolywrapManifest',
    'deserializePolywrapManifest',
    'validatePolywrapManifest',
]
