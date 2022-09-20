from ... import import_manifest
from typing import TypeAlias
import os

local_path: os.PathLike = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

__0_0_1_prealpha_1 = import_manifest('0.0.1-prealpha.1', local_path)
OldManifest: TypeAlias = __0_0_1_prealpha_1.MetaManifest
__0_0_1_prealpha_3 = import_manifest('0.0.1-prealpha.3', local_path)
NewManifest: TypeAlias = __0_0_1_prealpha_3.MetaManifest

def migrate(old: OldManifest) -> NewManifest:
    new: NewManifest = old
    new.__type = "MetaManifest"
    new.format = "0.0.1-prealpha.3"
    return new