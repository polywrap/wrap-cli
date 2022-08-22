from __future__ import annotations

from core import (
    ClientConfig,
    Uri,
    PluginRegistration,
    InterfaceImplementations,
    CoreInterfaceUris,
    RedirectsResolver,
    CacheResolver,
    PluginResolver,
    ExtendableUriResolver
)
from plugins import (
    ipfs_plugin,
    IpfsPluginConfig
)
from .wasm.wasm_web3_api import WasmWeb3Api


def get_default_client_config() -> ClientConfig:
    return ClientConfig(
        envs = [],
        redirects = [],
        plugins = [
            PluginRegistration(
                uri = Uri("w3://ens/ipfs.web3api.eth"),
                plugin = ipfs_plugin(
                    opts = IpfsPluginConfig(
                        provider = default_ipfs_providers[0],
                        fallback_providers = default_ipfs_providers[1]
                    )
                )
            ),
            # TODO: pol-34 plugins
            # PluginRegistration(
            #     uri = Uri("w3://ens/ens.web3api.eth"),
            #     plugin = ens_plugin()
            # ),
            # PluginRegistration(
            #     uri = Uri("w3://ens/ethereum.web3api.eth"),
            #     plugin = ethereum_plugin(
            #         networks = None
            #     )
            # ),
            # PluginRegistration(
            #     uri = Uri("w3://ens/http.web3api.eth"),
            #     plugin = http_plugin()
            # ),
            # PluginRegistration(
            #     uri = Uri("w3://ens/js-logger.web3api.eth"),
            #     plugin = logger_plugin()
            # ),
            # PluginRegistration(
            #     uri = Uri("w3://ens/uts46.web3api.eth"),
            #     plugin = uts46_plugin()
            # ),
            # PluginRegistration(
            #     uri = Uri("w3://ens/sha3.web3api.eth"),
            #     plugin = sha3_plugin()
            # ),
            # PluginRegistration(
            #     uri = Uri("w3://ens/sha3.web3api.eth"),
            #     plugin = graph_node_plugin(
            #         provider = "https://api.thegraph.com"
            #     )
            # ),
            # PluginRegistration(
            #     uri = Uri("w3://ens/fs.web3api.eth"),
            #     plugin = filesystem_plugin()
            # ),
        ],
        interfaces = [
            InterfaceImplementations(
                interface = CoreInterfaceUris.uri_resolver.value,
                implementations = [
                    Uri("w3://ens/ipfs.web3api.eth"),
                    Uri("w3://ens/ens.web3api.eth"),
                    Uri("w3://ens/fs.web3api.eth"),
                ]
            ),
            InterfaceImplementations(
                interface = CoreInterfaceUris.logger.value,
                implementations = [
                    Uri("w3://ens/js-logger.web3api.eth"),
                ]
            ),
        ],
        uri_resolvers = [
            RedirectsResolver(),
            CacheResolver(),
            PluginResolver(
                create_plugin_api = create_plugin_api
            ),
            ExtendableUriResolver(
                _create_api = create_api
            )    
        ]
    )

def create_plugin_api(uri: Uri, plugin: PluginPackage, environment: Env):
    return None # TODO: pol-34 plugins PluginWeb3Api(uri, plugin, environment)

def create_api(uri: Uri, manifest: Web3ApiManifest, uri_resolver: str, environment: Env):
    return WasmWeb3Api(uri, manifest, uri_resolver, environment)


default_ipfs_providers = [
    "https://ipfs.w3pers.io",
    "https://ipfs.io",
]
