# NOTE: This is an auto-generated file. All modifications will be overwritten.
from __future__ import annotations

from abc import abstractmethod
from typing import TypeVar, Generic, TypedDict, Optional

from .types import *

from polywrap_core import InvokerClient, UriPackageOrWrapper
from polywrap_plugin import PluginModule

TConfig = TypeVar("TConfig")



class ArgsSampleMethod(TypedDict):
    data: str

class Module(Generic[TConfig], PluginModule[TConfig]):
    @abstractmethod
    def sample_method(
        args: ArgsSampleMethod,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> str:
        pass

