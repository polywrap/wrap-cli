# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `__init__.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from enum import Enum, unique
from typing import TypeAlias, Union, final
from formats import import_manifest
from migrate import migrateMetaManifest
from deserialize import deserializeMetaManifest
from validate import validateMetaManifest

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1','py.src.core.manifest.formats.polywrap.migrators')
MetaManifest0_0_1_prealpha_1: TypeAlias = __0_0_1_prealpha_1.MetaManifest
__0_0_1_prealpha_2 = import_manifest('0.0.1-prealpha.2','py.src.core.manifest.formats.polywrap.migrators')
MetaManifest0_0_1_prealpha_2: TypeAlias = __0_0_1_prealpha_2.MetaManifest
__0_0_1_prealpha_3 = import_manifest('0.0.1-prealpha.3','py.src.core.manifest.formats.polywrap.migrators')
MetaManifest0_0_1_prealpha_3: TypeAlias = __0_0_1_prealpha_3.MetaManifest


@final
@unique
class MetaManifestFormats(Enum):
    _0_0_1_prealpha_1 = '0.0.1-prealpha.1'
    _0_0_1_prealpha_2 = '0.0.1-prealpha.2'
    _0_0_1_prealpha_3 = '0.0.1-prealpha.3'


AnyMetaManifest: TypeAlias = Union[
    MetaManifest0_0_1_prealpha_1,
    MetaManifest0_0_1_prealpha_2,
    MetaManifest0_0_1_prealpha_3,
]
MetaManifest: TypeAlias = MetaManifest0_0_1_prealpha_3
latestMetaManifestFormat = MetaManifestFormats('0.0.1-prealpha.3')

__all__ = [
    'MetaManifest0_0_1_prealpha_1',
    'MetaManifest0_0_1_prealpha_2',
    'MetaManifest0_0_1_prealpha_3',
    'MetaManifestFormats',
    'AnyMetaManifest',
    'MetaManifest',
    'latestMetaManifestFormat',
    'migrateMetaManifest',
    'deserializeMetaManifest',
    'validateMetaManifest',
]
