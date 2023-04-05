/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

from abc import ABC, abstractmethod
from typing import TypeVar, Generic, TypedDict

from .types import *

from polywrap_core import InvokerClient, MaybeAsync, UriPackageOrWrapper
from polywrap_plugin import PluginModule

TConfig = TypeVar("TConfig")



class ArgsModuleMethod(TypedDict):
    p_str: str
    opt_str: str | None
    en: CustomEnum
    opt_enum: CustomEnum | None
    enum_array: list[CustomEnum]
    opt_enum_array: list[CustomEnum | None] | None
    p_map: GenericMap[str, int]
    map_of_arr: GenericMap[str, list[int]]
    map_of_map: GenericMap[str, GenericMap[str, int]]
    map_of_obj: GenericMap[str, AnotherType]
    map_of_arr_of_obj: GenericMap[str, list[AnotherType]]

class ArgsObjectMethod(TypedDict):
    p_object: AnotherType
    opt_object: AnotherType | None
    object_array: list[AnotherType]
    opt_object_array: list[AnotherType | None] | None

class ArgsOptionalEnvMethod(TypedDict):
    p_object: AnotherType
    opt_object: AnotherType | None
    object_array: list[AnotherType]
    opt_object_array: list[AnotherType | None] | None

class ArgsIf(TypedDict):
    p_if: Else

class Module(Generic[TConfig], PluginModule[TConfig]) {
    @abstractmethod
    def module_method(
        args: ArgsModuleMethod,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> int:
        pass

    @abstractmethod
    def object_method(
        args: ArgsObjectMethod,
        client: InvokerClient[UriPackageOrWrapper],
        env: Env
    ) -> AnotherType | None:
        pass

    @abstractmethod
    def optional_env_method(
        args: ArgsOptionalEnvMethod,
        client: InvokerClient[UriPackageOrWrapper],
        env: Optional[Env] = None
    ) -> AnotherType | None:
        pass

    @abstractmethod
    def p_if(
        args: ArgsIf,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> Else:
        pass
}
