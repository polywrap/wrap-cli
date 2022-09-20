from ... import import_manifest
from typing import TypeAlias
import os

local_path: os.PathLike = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

__0_0_1_prealpha_4 = import_manifest('0.0.1-prealpha.4', local_path)
OldManifest: TypeAlias = __0_0_1_prealpha_4.PolywrapManifest
__0_0_1_prealpha_9 = import_manifest('0.0.1-prealpha.9', local_path)
NewManifest: TypeAlias = __0_0_1_prealpha_9.PolywrapManifest


def migrate(_: OldManifest) -> NewManifest:
    raise Exception('Manifest file is deprecated. Please update to 0.0.1-prealpha.9')