/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

from abc import ABC, abstractmethod
from typing import TypeVar, Generic

import .types as types

from polywrap_core import InvokerClient, MaybeAsync, UriPackageOrWrapper
from polywrap_plugin import PluginModule

TConfig = TypeVar("TConfig")



class ArgsmoduleMethod(TypedDict):
    str: Types.String;
    optStr: Optional[Union[Types.String, None]];
    en: Types.CustomEnum;
    optEnum: Optional[Union[Types.CustomEnum, None]];
    enumArray: List[Types.CustomEnum];
    optEnumArray: Optional[Union[List[Union[Types.CustomEnum, None]], None]];
    map: GenericMap[Types.String, Types.Int];
    mapOfArr: GenericMap[Types.String, List[Types.Int]];
    mapOfMap: GenericMap[Types.String, GenericMap[Types.String, Types.Int]];
    mapOfObj: GenericMap[Types.String, Types.AnotherType];
    mapOfArrOfObj: GenericMap[Types.String, List[Types.AnotherType]];

class ArgsobjectMethod(TypedDict):
    object: Types.AnotherType;
    optObject: Optional[Union[Types.AnotherType, None]];
    objectArray: List[Types.AnotherType];
    optObjectArray: Optional[Union[List[Union[Types.AnotherType, None]], None]];

class ArgsoptionalEnvMethod(TypedDict):
    object: Types.AnotherType;
    optObject: Optional[Union[Types.AnotherType, None]];
    objectArray: List[Types.AnotherType];
    optObjectArray: Optional[Union[List[Union[Types.AnotherType, None]], None]];

class Argsif(TypedDict):
    if: Types._else;

class Module(Generic[TConfig], PluginModule[TConfig]) {
  @abstractmethod
  def moduleMethod(
    args: ArgsmoduleMethod,
    client: InvokerClient[UriPackageOrWrapper],
    env: None
  ): MaybeAsync<Types.Int>;

  @abstractmethod
  def objectMethod(
    args: ArgsobjectMethod,
    client: InvokerClient[UriPackageOrWrapper],
    env: types.Env
  ): MaybeAsync<Union[Types.AnotherType, None]>;

  @abstractmethod
  def optionalEnvMethod(
    args: ArgsoptionalEnvMethod,
    client: InvokerClient[UriPackageOrWrapper],
    env: Optional[types.Env] = None
  ): MaybeAsync<Union[Types.AnotherType, None]>;

  @abstractmethod
  def if(
    args: Argsif,
    client: InvokerClient[UriPackageOrWrapper],
    env: None
  ): MaybeAsync<Types._else>;
}
