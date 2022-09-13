from typing import Any

from . import Client
from . import Env
from . import GetManifestOptions
from . import InvokeApiOptions, InvokeApiResult
from . import Plugin, PluginModule, PluginPackage, PluginPackageManifest
from . import Uri

# These will all fail
from . import isBuffer, msgpackDecode


class PluginWrapper:
    """
    A plugin wrapper can be used to spawn many invocations of this particular
    plugin.
    """

    def __init__(self, uri:Uri, plugin_package:PluginPackage, env:Env) -> None:
        self._uri = uri
        self._plugin_package = plugin_package
        self._env = env
        self._instance = None
        self._sanitized_env = None

    async def invoke(self, options:InvokeApiOptions, client:Client) -> InvokeApiResult:
        """
        Invoke the wrapper using the provided options.
        """
        method = options.method
        args = getattr(options, 'args', {})
        module = self._getInstance()

        if module is None:
            raise BaseException('PluginWrapper: module not found')

        if module.get_method(method) is None:
            raise BaseException(f'PluginWrapper: {method} not found')

        await self._sanitizeAndLoadEnv(client, module)

        js_args = args

        if isBuffer(args):
            result = msgpackDecode(args)
            # FIXME: Revisit this when we know what msgpackDecode returns.
            if type(result) is not dict:
                raise BaseException('PluginWrapper: decoded MsgPack args did not result in an object.')
            js_args = result
        
        data = await module._wrap_invoke(method, js_args, client)
        return {'data': data, 'encoded': False}

    def getSchema(self, options: GetManifestOptions, client:Client) -> str:
        """
        Get the wrapper's schema.
        """
        return self.getManifest().schema

    def getManifest(self, options:InvokeApiOptions, client:Client) -> Any:
        """
        Get the wrapper's manifest.
        """
        return self._plugin_package.manifest

    def _getInstance(self) -> PluginModule:
        self._instance = self._instance or self._plugin_package.factory()
        return self._instance

    async def _sanitizeAndLoadEnv(self, client: Client, plugin_module: PluginModule):
        if self._sanitized_env is not None:
            return
        self._sanitized_env = await plugin_module._wrap_sanitize_env(
            self._getClientEnv(),
            client
        )

    def _getClientEnv(self) -> dict:
        if self._env is None:
            return {}
        return self._env
