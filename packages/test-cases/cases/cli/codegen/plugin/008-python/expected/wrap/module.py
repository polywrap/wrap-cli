# NOTE: This is an auto-generated file. All modifications will be overwritten.
# type: ignore
from __future__ import annotations

from abc import abstractmethod
from typing import TypeVar, Generic, TypedDict, Optional

from .types import *

from polywrap_core import InvokerClient
from polywrap_plugin import PluginModule
from polywrap_msgpack import GenericMap

TConfig = TypeVar("TConfig")


ArgsSampleMethod = TypedDict("ArgsSampleMethod", {
    "data": str
})


class Module(Generic[TConfig], PluginModule[TConfig]):
    def __new__(cls, *args, **kwargs):
        # NOTE: This is used to dynamically add WRAP ABI compatible methods to the class
        instance = super().__new__(cls)
        setattr(instance, "sampleMethod", instance.sample_method)
        return instance

    @abstractmethod
    def sample_method(
        self,
        args: ArgsSampleMethod,
        client: InvokerClient,
        env: None
    ) -> str:
        pass

