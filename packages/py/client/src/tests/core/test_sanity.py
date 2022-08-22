from __future__ import annotations
import pytest

from ...web3_api_client import Web3ApiClient, Web3ApiClientConfig
from core import (
    GetRedirectsOptions,
    Uri,
    CoreInterfaceUris,
    InterfaceImplementations,
    UriRedirect,
    PluginPackageManifest,
    PluginPackage,
    PluginRegistration,
    GetSchemaOptions
)


class PluginPackageTest(PluginPackage):
    def __init__(self, schema = "", implements = []):
        self.manifest = PluginPackageManifest(
            schema = schema,
            implements = implements
        )
    
    @classmethod
    def factory(cls) -> Plugin:
        return None


async def test_default_client_config():
    client = Web3ApiClient()

    assert client.get_redirects(GetRedirectsOptions(context_id="")) == []
    # TODO: pol-34 plugins
    # assert client.get_plugins() == [
    #     Uri("w3://ens/ipfs.web3api.eth"),
    #     Uri("w3://ens/ens.web3api.eth"),
    #     Uri("w3://ens/ethereum.web3api.eth"),
    #     Uri("w3://ens/http.web3api.eth"),
    #     Uri("w3://ens/js-logger.web3api.eth"),
    #     Uri("w3://ens/uts46.web3api.eth"),
    #     Uri("w3://ens/sha3.web3api.eth"),
    #     Uri("w3://ens/graph-node.web3api.eth"),
    #     Uri("w3://ens/fs.web3api.eth"),
    # ]
    assert client.get_interfaces() == [
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
                Uri("w3://ens/js-logger.web3api.eth")
            ]
        ),
    ]


async def test_client_nodefaults_flag_works_as_expected():
    client = Web3ApiClient()
    assert len(client.get_plugins()) != 0

    client = Web3ApiClient(None, None)
    assert len(client.get_plugins()) != 0

    client = Web3ApiClient(None, {'no_defaults': False})
    assert len(client.get_plugins()) != 0

    client = Web3ApiClient(None, {'no_defaults': True})
    assert len(client.get_plugins()) == 0


async def test_redirect_registration():
    implementation1Uri = "w3://ens/some-implementation1.eth"
    implementation2Uri = "w3://ens/some-implementation2.eth"

    client = Web3ApiClient(
        config = Web3ApiClientConfig(
            redirects = [
                UriRedirect(
                    from_uri =implementation1Uri,
                    to_uri = implementation2Uri
                ),
            ]
        )
    )

    redirects = client.get_redirects(GetRedirectsOptions(context_id=""))

    assert redirects == [
        UriRedirect(
            from_uri = Uri(implementation1Uri),
            to_uri = Uri(implementation2Uri)
        )
    ]


# TODO: pol-34 get_schema leads to find_plugin_package, need plugins
# async def test_load_web3_api_pass_str_or_uri():
#     implementation_uri = "w3://ens/some-implementation.eth"
#     schema_str = "test-schema"

#     client = Web3ApiClient(
#         config = Web3ApiClientConfig(
#             plugins = [
#                 PluginRegistration(
#                     uri = implementation_uri,
#                     plugin = PluginPackageTest(schema=schema_str)
#                 )
#             ],
#         )
#     )

#     schema_when_string = await client.get_schema(implementation_uri, GetSchemaOptions(context_id=""))
#     schema_when_uri = await client.get_schema(Uri(implementation_uri), GetSchemaOptions(context_id=""))
