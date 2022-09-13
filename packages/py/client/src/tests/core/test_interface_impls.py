from __future__ import annotations
import pytest 

from core import (
    InterfaceImplementations,
    ClientConfig,
    Uri,
    UriRedirect,
    PluginRegistration,
    PluginPackage,
    PluginPackageManifest,
    GetImplementationsOptions,
    CoreInterfaceUris
)
from ...create_web3_api_client import PluginConfigs, create_web3_api_client
from ...web3_api_client import Web3ApiClientConfig, Web3ApiClient
from ...default_client_config import get_default_client_config

async def get_client(config: Web3ApiClientConfig = None):
    client = await create_web3_api_client(
        None,
        config
    )
    return client


class PluginPackageTest(PluginPackage):
    def __init__(self, schema = "", implements = []):
        self.manifest = PluginPackageManifest(
            schema = schema,
            implements = implements
        )
    
    @classmethod
    def factory(cls) -> Plugin:
        return None


async def test_should_register_interface_implementations_successfully():
    interface_uri = "w3://ens/some-interface1.eth"
    implementation1_uri = "w3://ens/some-implementation1.eth"
    implementation2_uri = "w3://ens/some-implementation2.eth"

    client = Web3ApiClient(
        config = Web3ApiClientConfig(
            interfaces = [
                InterfaceImplementations(
                    interface = interface_uri,
                    implementations = [implementation1_uri , implementation2_uri]
                )
            ]
        )
    )

    interfaces = client.get_interfaces()

    default_client_config = get_default_client_config()

    assert interfaces == [
        InterfaceImplementations(
            interface = Uri(interface_uri),
            implementations = [Uri(implementation1_uri) , Uri(implementation2_uri)]
        )
    ] + default_client_config.interfaces

    implementations = client.get_implementations(interface_uri)

    assert implementations == [implementation1_uri , implementation2_uri]


async def test_get_all_implementations_of_interface():
    interface1Uri = "w3://ens/some-interface1.eth"
    interface2Uri = "w3://ens/some-interface2.eth"
    interface3Uri = "w3://ens/some-interface3.eth"

    implementation1Uri = "w3://ens/some-implementation.eth"
    implementation2Uri = "w3://ens/some-implementation2.eth"
    implementation3Uri = "w3://ens/some-implementation3.eth"
    implementation4Uri = "w3://ens/some-implementation4.eth"

    client = await get_client(
        config = Web3ApiClientConfig(
            redirects = [
                UriRedirect(
                    from_uri =interface1Uri,
                    to_uri = interface2Uri
                ),
                UriRedirect(
                    from_uri =implementation1Uri,
                    to_uri = implementation2Uri
                ),
                UriRedirect(
                    from_uri =implementation2Uri,
                    to_uri = implementation3Uri
                ),
            ],
            plugins = [
                PluginRegistration(
                    uri = implementation4Uri,
                    plugin = PluginPackageTest()
                )
            ],
            interfaces = [
                InterfaceImplementations(
                    interface = (interface1Uri),
                    implementations = [(implementation1Uri) , (implementation2Uri)]
                ),
                InterfaceImplementations(
                    interface = (interface2Uri),
                    implementations = [(implementation3Uri)]
                ),
                InterfaceImplementations(
                    interface = (interface3Uri),
                    implementations = [(implementation3Uri) , (implementation4Uri)]
                ),
            ]
        )
    )

    implementations1 = client.get_implementations(
        interface1Uri,
        GetImplementationsOptions(
            context_id = "",
            apply_redirects = True
        )
    )
    implementations2 = client.get_implementations(
        interface2Uri,
        GetImplementationsOptions(
            context_id = "",
            apply_redirects = True
        )
    )
    implementations3 = client.get_implementations(
        interface3Uri,
        GetImplementationsOptions(
            context_id = "",
            apply_redirects = True
        )
    )

    assert implementations1 == [
        implementation1Uri,
        implementation2Uri,
        implementation3Uri,
    ]


async def test_should_not_register_plugins_with_interface_without_default():
    interface1Uri = "w3://ens/some-interface1.eth"
    interface2Uri = "w3://ens/some-interface2.eth"
    interface3Uri = "w3://ens/some-interface3.eth"

    implementationUri = "w3://ens/some-implementation.eth"
    with pytest.raises(ValueError, match = f"Plugins can't use interfaces for their URI. Invalid plugins:"):

        client = await get_client(
            config = Web3ApiClientConfig(
                plugins = [
                    PluginRegistration(
                        uri = interface1Uri,
                        plugin = PluginPackageTest()
                    ),
                    PluginRegistration(
                        uri = interface2Uri,
                        plugin = PluginPackageTest()
                    ),
                ],
                interfaces = [
                    InterfaceImplementations(
                        interface = (interface1Uri),
                        implementations = [implementationUri]
                    ),
                    InterfaceImplementations(
                        interface = (interface2Uri),
                        implementations = [implementationUri]
                    ),
                    InterfaceImplementations(
                        interface = (interface3Uri),
                        implementations = [implementationUri]
                    ),
                ]
            )
        )


async def test_should_not_register_plugins_with_interface_with_default():
    interfaceUri = "w3://ens/some-interface.eth"
    implementationUri = "w3://ens/some-implementation.eth"
 
    with pytest.raises(ValueError, match = f"Plugins can't use interfaces for their URI. Invalid plugins:"):

        client = await get_client(
            config = Web3ApiClientConfig(
                plugins = [
                    PluginRegistration(
                        uri = interfaceUri,
                        plugin = PluginPackageTest()
                    ),
                ],
                interfaces = [
                    InterfaceImplementations(
                        interface = interfaceUri,
                        implementations = [implementationUri]
                    )
                ]
            )
        )


async def test_should_merge_user_interface_implementations_with_each_other():
    interfaceUri = "w3://ens/interface.eth"

    implementationUri1 = "w3://ens/implementation1.eth"
    implementationUri2 = "w3://ens/implementation2.eth"

    client = await get_client(
        config = Web3ApiClientConfig(
            interfaces = [
                InterfaceImplementations(
                    interface = interfaceUri,
                    implementations = [implementationUri1]
                ),
                InterfaceImplementations(
                    interface = interfaceUri,
                    implementations = [implementationUri2]
                ),
            ]
        )
    )

    interfaces = [x for x in client.get_interfaces() if x.interface.uri == interfaceUri]

    assert len(interfaces) == 1

    implementation_uris = interfaces[0].implementations

    assert implementation_uris == [
        Uri(implementationUri1),
        Uri(implementationUri2)
    ]


async def test_should_merge_user_interface_implementations_with_defaults():
    interfaceUri = CoreInterfaceUris.uri_resolver.value.uri

    implementationUri1 = "w3://ens/implementation1.eth"
    implementationUri2 = "w3://ens/implementation2.eth"

    client = await get_client(
        config = Web3ApiClientConfig(
            interfaces = [
                InterfaceImplementations(
                    interface = interfaceUri,
                    implementations = [implementationUri1]
                ),
                InterfaceImplementations(
                    interface = interfaceUri,
                    implementations = [implementationUri2]
                ),
            ]
        )
    )

    interfaces = [x for x in client.get_interfaces() if x.interface.uri == interfaceUri]

    assert len(interfaces) == 1


    implementation_uris = interfaces[0].implementations

    expected = [
        Uri(implementationUri1),
        Uri(implementationUri2),
    ] + next(x for x in get_default_client_config().interfaces if x.interface.uri == interfaceUri).implementations

    for e in expected:
        assert e in implementation_uris


async def test_get_implementations_do_not_return_plugins_not_explicitly_registered():
    interfaceUri = "w3://ens/some-interface.eth"

    implementationUri1 = "w3://ens/some-implementation1.eth"
    implementationUri2 = "w3://ens/some-implementation2.eth"

    client = await get_client(
        config = Web3ApiClientConfig(
            plugins = [
                PluginRegistration(
                    uri = implementationUri1,
                    plugin = PluginPackageTest(implements = [Uri(interfaceUri)])
                )
            ],
            interfaces = [
                InterfaceImplementations(
                    interface = interfaceUri,
                    implementations = [implementationUri2]
                ),
            ]
        )
    )

    get_implementation_results = client.get_implementations(
        Uri(interfaceUri),
        GetImplementationsOptions(
            context_id = "",
            apply_redirects = True
        )
    )

    assert get_implementation_results == [Uri(implementationUri2)]


async def test_get_implementations_return_implementations_for_plugins_which_dont_have_interface_stated_in_manifest():
    interfaceUri = "w3://ens/some-interface.eth"

    implementationUri1 = "w3://ens/some-implementation1.eth"
    implementationUri2 = "w3://ens/some-implementation2.eth"

    client = await get_client(
        config = Web3ApiClientConfig(
            plugins = [
                PluginRegistration(
                    uri = implementationUri1,
                    plugin = PluginPackageTest()
                )
            ],
            interfaces = [
                InterfaceImplementations(
                    interface = interfaceUri,
                    implementations = [implementationUri1, implementationUri2]
                ),
            ]
        )
    )

    get_implementation_results = client.get_implementations(
        Uri(interfaceUri),
        GetImplementationsOptions(
            context_id = "",
            apply_redirects = True
        )
    )

    assert get_implementation_results == [
        Uri(implementationUri1),
        Uri(implementationUri2)
    ]


async def test_get_implementations_pass_string_or_uri():
    oldInterfaceUri = "ens/old.eth"
    newInterfaceUri = "ens/new.eth"

    implementationUri1 = "w3://ens/some-implementation1.eth"
    implementationUri2 = "w3://ens/some-implementation2.eth"

    client = await get_client(
        config = Web3ApiClientConfig(
            redirects = [
                UriRedirect(
                    from_uri = oldInterfaceUri,
                    to_uri = newInterfaceUri
                ),
            ],
            interfaces = [
                InterfaceImplementations(
                    interface = oldInterfaceUri,
                    implementations = [implementationUri1]
                ),
                InterfaceImplementations(
                    interface = newInterfaceUri,
                    implementations = [implementationUri2]
                ),
            ]
        )
    )

    result = client.get_implementations(
        oldInterfaceUri
    )
    assert result == [implementationUri1]

    result = client.get_implementations(
        oldInterfaceUri,
        GetImplementationsOptions(
            context_id = "",
            apply_redirects = True
        )
    )
    assert result == [implementationUri1, implementationUri2]

    result2 = client.get_implementations(
        Uri(oldInterfaceUri)
    )
    assert result2 == [Uri(implementationUri1)]

    result = client.get_implementations(
        Uri(oldInterfaceUri),
        GetImplementationsOptions(
            context_id = "",
            apply_redirects = True
        )
    )
    assert result == [Uri(implementationUri1), Uri(implementationUri2)]

