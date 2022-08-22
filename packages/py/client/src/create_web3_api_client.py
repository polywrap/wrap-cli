from __future__ import annotations
import inspect

from .web3_api_client import Web3ApiClient, Web3ApiClientConfig
from .plugin_configs import PluginConfigs, modules, uris

async def create_web3_api_client(
    plugin_configs: PluginConfigs,
    config: Web3ApiClientConfig = None
) -> Web3ApiClient:
    plugins = []
    plugin_conf_dict = plugin_configs.__dict__ if plugin_configs else {}
    for plugin in plugin_conf_dict:
        if not modules.get(plugin, None):
            raise ValueError(f"Requested plugin \"{plugin}\" is not a supported createWeb3ApiClient plugin.")

        try:
            plugin_module = __import__(modules[plugin])
        except Exception as e:
            raise ValueError(f'Failed to import plugin module. Please install the package "{modules[plugin]}".\n Error: {str(e)}')

        plugin_factory = plugin_module["plugin"]

        if not plugin_factory:
            raise ValueError(f'Plugin module "{modules[plugin]}" is missing the "plugin: PluginFactory" export.')

        if not callable(plugin_factory):
            raise ValueError(f'The "plugin: PluginFactory" export must be a function. Found in module "{modules[plugin]}".')

        plugin_package = plugin_factory(plugin_configs)

        if (
            not plugin_package or
            not inspect.isclass(plugin_package) or
            not plugin_package.factory or
            not plugin_package.manifest
        ):
            raise ValueError(f'Plugin package is malformed. Expected object with keys "factory" and "manifest". Got: {plugin_package}')

        plugins.append({
            "uri": uris[plugin],
            "plugin": plugin_package
        })

    if config:
        return Web3ApiClient(
            config = Web3ApiClientConfig(
                redirects=config.redirects,
                plugins=plugins + config.plugins if config.plugins else [],
                interfaces=config.interfaces,
                envs=config.envs,
                uri_resolvers=config.uri_resolvers
            )
        )
    else:
        return Web3ApiClient(
            config = Web3ApiClientConfig(
                plugins=plugins
            )
        )
