from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, Any, Awaitable, List
from abc import ABC, abstractmethod

from . import Uri, execute_maybe_async_function


async def plugin_method(input: Dict[str, Any], client: Client) -> Awaitable[Any]:
    return


class PluginModule:
    _env = {}

    def __init__(self, config: Dict[str, Any]):
        self._config = config

    def get_env(self) -> Dict[str, Any]:
        return self._env

    def get_config(self) -> Dict[str, Any]:
        return self._config

    def w3_load_env(self, env: Dict[str, Any]):
        self._env = env

    async def w3_sanitize_env(self, client_env: Dict[str, Any], client: Client) -> Awaitable[Dict[str, Any]]:
        if self.get_method("sanitize_env"):
            return self.w3_invoke("sanitize_env", client_env, client)
        else:
            return client_env

    async def w3_invoke(self, method: str, input: Dict[str, Any], client: Client) -> Awaitable[Any]:
        fn = self.get_method(method)

        if not fn:
            raise NotImplementedError("TODO: missing function")

        if not callable(fn):
            raise ValueError(f"TODO: {method} must be a function")

        return await execute_maybe_async_function(fn, input, client)

    def get_method(self, method: str):
        return getattr(self, method)


class Plugin(ABC):
    """The plugin instance."""

    @classmethod
    @abstractmethod
    def get_module(cls) -> PluginModule:
        """
        Get an instance of this plugin's modules.

        :param client: The client instance requesting the modules be used for any sub
        """
        return


@dataclass
class PluginPackageManifest:
    """The plugin package's manifest."""

    schema: str
    """The API's schema"""
    implements: List[Uri]
    """All interface schemas implemented by this plugin"""


class PluginPackage(ABC):
    def __init__(self, manifest: List[Uri]):
        self.manifest = manifest

    @classmethod
    @abstractmethod
    def factory(cls) -> Plugin:
        return
