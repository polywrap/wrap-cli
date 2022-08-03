from __future__ import annotations
from typing import Awaitable

from ...resolvers import get_env_from_uri_or_resolution_stack
from ....uri_resolution import UriResolver, UriResolutionResult
from ....algorithms import find_plugin_package


class PluginResolver(UriResolver):
    def __init__(self, create_plugin_api: Api):
        self.create_plugin_api = create_plugin_api

    @property
    def name(self) -> str:
        return type(self).__name__

    async def resolve_uri(
        self, uri: Uri, client: Client, cache: ApiCache, resolution_path: UriResolutionStack
    ) -> Awaitable(UriResolutionResult):
        plugin = find_plugin_package(uri, client.get_plugins({}))

        if plugin:
            environment = get_env_from_uri_or_resolution_stack(uri, resolution_path, client)

            print(f'what is it {self.create_plugin_api}')
            api = self.create_plugin_api(uri, plugin, environment)
            print(f'did we get api {api}')

            return UriResolutionResult(uri, api)

        return UriResolutionResult(uri)
