from ... import import_manifest
from typing import TypeAlias
import os

local_path: os.PathLike = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

__0_0_1_prealpha_2 = import_manifest('0.0.2-prealpha.1', local_path)
OldManifest: TypeAlias = __0_0_1_prealpha_2.PluginManifest
__0_0_1_prealpha_3 = import_manifest('0.0.1-prealpha.3', local_path)
NewManifest: TypeAlias = __0_0_1_prealpha_3.PluginManifest


def migrate(_: OldManifest) -> NewManifest:
    raise Exception('Plugin manifest file is deprecated. Please update to 0.0.1-prealpha.3')
