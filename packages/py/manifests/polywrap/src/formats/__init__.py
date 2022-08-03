from importlib.util import module_from_spec, spec_from_file_location
from importlib.machinery import ModuleSpec
import sys
from os import PathLike
from types import ModuleType
from typing import Literal, Type, TypeAlias, TypeVar

ManifestArtifactType: TypeAlias = Literal[
    'PolywrapManifest', 'MetaManifest', 'BuildManifest', 'DeployManifest', 'InfraManifest'
]
TManifestType = TypeVar('TManifestType', bound=ManifestArtifactType)
AnyManifestArtifact: TypeAlias = Type[TManifestType]


def import_manifest(name: str, path: PathLike) -> ModuleType:
    # reference docs: https://docs.python.org/3/library/importlib.html#importing-a-source-file-directly
    spec: ModuleSpec = spec_from_file_location(name, path)
    module: ModuleType = module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module
