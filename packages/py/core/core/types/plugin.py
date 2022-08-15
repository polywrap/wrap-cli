from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Dict, List, Optional

from . import Client, Uri, execute_maybe_async_function

PluginMethod = Callable[[Dict[str, Any], Client], Awaitable[Any]]


class PluginModule(ABC):
    _env: Optional[Dict[str, Any]] = None
    _config: Dict[str, Any]

    def __init__(self, config: Dict[str, Any]):
        self._config = config

    @property
    def env(self) -> Dict[str, Any]:
        return self._env

    @property
    def config(self) -> Dict[str, Any]:
        return self._config

    def set_env(self, env: Dict[str, Any]) -> None:
        self._env = env

    async def wrap_invoke(self, method: str, args: Dict[str, Any], client: Client) -> Awaitable[Any]:
        fn = self.get_method(method)

        if not fn:
            raise NotImplementedError(f"Plugin missing method '{method}'")

        if not callable(fn):
            raise ValueError(f"Plugin method '{method}' must be of type 'function")

        return await execute_maybe_async_function(fn, input, client)

    def get_method(self, method: str):
        return getattr(self, method)


@dataclass(slots=True, kw_only=True)
class PluginPackageManifest:
    """
    The plugin package's manifest.

    Args:
        schema: the plugin wrapper's schema
        implements: all interface schemas implemented by this plugin
    """

    schema: str
    implements: List[Uri]


class PluginPackage(ABC):
    manifest: PluginPackageManifest

    def __init__(self, manifest: List[Uri]):
        self.manifest = manifest

    @abstractmethod
    def factory(self) -> PluginModule:
        pass
