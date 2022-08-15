from __future__ import annotations

from typing import Awaitable, Callable

from ....algorithms import find_plugin_package
from ....types import Client, Env, PluginPackage, Uri, Wrapper, WrapperCache
from ...core import UriResolutionResult, UriResolutionStack, UriResolver
from ..get_env_from_uri_or_resolution import get_env_from_uri_or_resolution_stack


class PluginResolver(UriResolver):
    create_plugin_wrapper: Callable[[Uri, PluginPackage, Env], Wrapper]

    def __init__(
        self, create_plugin_wrapper: Callable[[Uri, PluginPackage, Env], Wrapper]
    ):
        self.create_plugin_wrapper = create_plugin_wrapper

    @property
    def name(self) -> str:
        return type(self).__name__

    async def resolve_uri(
        self,
        uri: Uri,
        client: Client,
        cache: WrapperCache,
        resolution_path: UriResolutionStack,
    ) -> Awaitable(UriResolutionResult):
        plugin = find_plugin_package(uri, client.get_plugins({}))

        if plugin:
            environment = get_env_from_uri_or_resolution_stack(
                uri, resolution_path, client
            )
            wrapper = self.create_plugin_wrapper(uri, plugin, environment)

            return UriResolutionResult(uri, wrapper)

        return UriResolutionResult(uri)
