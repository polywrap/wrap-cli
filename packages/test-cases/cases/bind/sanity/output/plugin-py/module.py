# NOTE: This is an auto-generated file. All modifications will be overwritten.
from __future__ import annotations

from abc import abstractmethod
from typing import TypeVar, Generic, TypedDict, Optional

from .types import *

from polywrap_core import InvokerClient, UriPackageOrWrapper
from polywrap_plugin import PluginModule

TConfig = TypeVar("TConfig")



class ArgsModuleMethod(TypedDict):
    p_str: str
    opt_str: Optional[str]
    en: "CustomEnum"
    opt_enum: Optional["CustomEnum"]
    enum_array: list["CustomEnum"]
    opt_enum_array: Optional[list[Optional["CustomEnum"]]]
    p_map: GenericMap[str, int]
    map_of_arr: GenericMap[str, list[int]]
    map_of_map: GenericMap[str, GenericMap[str, int]]
    map_of_obj: GenericMap[str, "AnotherType"]
    map_of_arr_of_obj: GenericMap[str, list["AnotherType"]]

class ArgsObjectMethod(TypedDict):
    p_object: "AnotherType"
    opt_object: Optional["AnotherType"]
    object_array: list["AnotherType"]
    opt_object_array: Optional[list[Optional["AnotherType"]]]

class ArgsOptionalEnvMethod(TypedDict):
    p_object: "AnotherType"
    opt_object: Optional["AnotherType"]
    object_array: list["AnotherType"]
    opt_object_array: Optional[list[Optional["AnotherType"]]]

class ArgsIf(TypedDict):
    p_if: "Else"

class Module(Generic[TConfig], PluginModule[TConfig]):
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
    ) -> Optional["AnotherType"]:
        pass

    @abstractmethod
    def optional_env_method(
        args: ArgsOptionalEnvMethod,
        client: InvokerClient[UriPackageOrWrapper],
        env: Optional[Env] = None
    ) -> Optional["AnotherType"]:
        pass

    @abstractmethod
    def p_if(
        args: ArgsIf,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> "Else":
        pass

