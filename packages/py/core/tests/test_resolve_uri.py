from __future__ import annotations
import pytest
from typing import Awaitable, Union

from .. import (
    Api,
    InvokeApiResult,
    AnyManifestArtifact,
    Subscription,
    Client,
    ManifestArtifactType,
    QueryApiResult,
    Uri,
    CoreInterfaceUris,
    PluginPackage,
    PluginRegistration,
    InterfaceImplementations,
    PluginResolver,
    RedirectsResolver,
    ExtendableUriResolver,
    DeserializeManifestOptions,
    UriResolverInterface,
    resolve_uri,
    InvokeApiOptions,
    Web3ApiManifest,
    UriRedirect,
)


class ApiTest(Api):
    def __init__(
        self,
        uri: Uri,
        manifest: Web3ApiManifest,
        uri_resolver: str,
    ):
        self.uri = uri
        self.manifest = manifest
        self.uri_resolver = uri_resolver

    async def invoke(self, options: InvokeApiOptions, client: Client) -> Awaitable[InvokeApiResult]:
        return InvokeApiResult(data={"uri": self.uri, "manifest": self.manifest, "uri_resolver": self.uri_resolver})

    @classmethod
    async def get_schema(cls, client: Client) -> Awaitable[str]:
        return ""

    @classmethod
    async def get_manifest(cls, options: GetManifestOptions, client: Client) -> Awaitable[AnyManifestArtifact]:
        return AnyManifestArtifact(
            format="0.0.1-prealpha.9",
            language="",
            main="",
            schema="",
            __type="Web3ApiManifest",
        )

    @classmethod
    async def get_file(cls, options: GetFileOptions, client: Client) -> Awaitable[Union[bytearray, str]]:
        return ""


class PluginApiTest(Api):
    def __init__(self, uri: Uri, plugin: PluginPackage, environment: Env = None):
        self.uri = uri
        self.plugin = plugin
        self.environment = environment

    async def invoke(self, options: InvokeApiOptions, client: Client) -> Awaitable[InvokeApiResult]:
        return InvokeApiResult(
            data={
                "uri": self.uri,
                "plugin": self.plugin,
            }
        )

    @classmethod
    async def get_schema(cls, client: Client) -> Awaitable[str]:
        return ""

    @classmethod
    async def get_manifest(cls, options: GetManifestOptions, client: Client) -> Awaitable[AnyManifestArtifact]:
        return AnyManifestArtifact(
            format="0.0.1-prealpha.9",
            language="",
            __type="PluginManifest",
        )

    @classmethod
    async def get_file(cls, options: GetFileOptions, client: Client) -> Awaitable[Union[bytearray, str]]:
        return ""


class SubscriptionTest(Subscription):
    frequency: int
    is_active: bool

    @classmethod
    def stop(cls):
        return None

    @classmethod
    async def async_iterator(cls) -> QueryApiResult:
        return None


class ClientTest(Client):
    def __init__(
        self,
        apis: Dict[str, PluginModule],
        plugins: List[PluginRegistration] = [],
        interfaces: List[InterfaceImplementations] = [],
        redirects: List[UriRedirect] = [],
    ):
        self.apis = apis
        self.plugins = plugins
        self.interfaces = interfaces
        self.redirects = redirects

    async def invoke(self, options: InvokeApiOptions) -> Awaitable[InvokeApiResult]:
        uri = options.uri
        if Uri.is_uri(uri):
            uri = uri.uri
        return InvokeApiResult(data=apis[uri](options.input, None) if apis.get(uri) else None)

    def get_redirects(self, options: GetRedirectsOptions) -> List[UriRedirect]:
        return self.redirects

    def get_plugins(self, options: GetPluginsOptions) -> List[PluginRegistration]:
        return self.plugins

    def get_interfaces(self, options: GetInterfacesOptions) -> List[InterfaceImplementations]:
        return self.interfaces

    def get_env_by_uri(self, uri: Union[Uri, str], options: GetEnvsOptions) -> Union[Env, None]:
        return None

    def get_uri_resolvers(self, options: GetUriResolversOptions) -> List[UriResolver]:
        return

    async def get_schema(self, uri: Union[Uri, str], options: GetSchemaOptions) -> Awaitable[str]:
        return ""

    async def get_manifest(self, uri: Union[Uri, str], options: GetManifestOptions) -> Awaitable[ManifestArtifactType]:
        return ManifestArtifactType(
            format="0.0.1-prealpha.8",
            language="",
            __type="Web3ApiManifest",
        )

    async def get_file(self, uri: Union[Uri, str], options: GetFileOptions) -> Awaitable[Union[Uri, str]]:
        return ""

    def get_implementations(self, uri: Union[Uri, str], options: GetImplementationsOptions) -> List[Union[Uri, str]]:
        return [uri]

    def resolve_uri(
        self, uri: Union[Uri, str], options: Optional[ResolveUriOptions] = None
    ) -> Awaitable[ResolveUriResult]:
        return None

    async def load_uri_resolvers(self) -> Awaitable[Dict[bool, List[str]]]:
        return

    async def query(self, _options: InvokeApiOptions) -> QueryApiResult:
        return QueryApiResult(
            data={
                "foo": "foo",
            }
        )

    def subscribe(self, _options: SubscribeOptions) -> Subscription:
        return SubscriptionTest(
            frequency=0,
            is_active=False,
        )


def ens_api(input: Dict[str, str], _client: Client):
    return {"uri": "ipfs/QmHash" if input["authority"] == "ens" else None}


def ipfs_api(input: Dict[str, str], _client: Client):
    return {"manifest": "format: 0.0.1-prealpha.9\ndog: cat" if input["authority"] == "ipfs" else None}


def plugin_api(input: Dict[str, str], _client: Client):
    return {"manifest": "format: 0.0.1-prealpha.9" if input["authority"] == "my" else None}


class PluginPackageTest(PluginPackage):
    def __init__(self, manifest: List[Uri]):
        self.manifest = manifest

    def factory(self) -> Plugin:
        return PluginPackageTest(self.manifest)


plugins = [
    PluginRegistration(
        uri=Uri("ens/my-plugin"),
        plugin=PluginPackageTest(
            manifest={
                "schema": "",
                "implements": [CoreInterfaceUris.uri_resolver],
            },
        ),
    ),
]

interfaces = [
    InterfaceImplementations(
        interface=CoreInterfaceUris.uri_resolver,
        implementations=[
            Uri("ens/ens"),
            Uri("ens/ipfs"),
            Uri("ens/my-plugin"),
        ],
    )
]

apis = {
    "w3://ens/ens": ens_api,
    "w3://ens/ipfs": ipfs_api,
    "w3://ens/my-plugin": plugin_api,
}


def create_plugin_api(uri: Uri, plugin: PluginPackage, environment: Env = None):
    return PluginApiTest(uri, plugin, environment)


def create_extendable_uri_resolver(
    uri: Uri, manifest: Web3ApiManifest, uri_resolver: str, environment: Union[Env, None]
):
    return ApiTest(uri, manifest, uri_resolver)


uri_resolvers = [
    RedirectsResolver(),
    PluginResolver(create_plugin_api),
    ExtendableUriResolver(create_extendable_uri_resolver, DeserializeManifestOptions(no_validate=True), True),
]


async def test_sanity_resolve_uri():
    api = Uri("w3://ens/ens")
    file = Uri("w3/some-file")
    path = "w3/some-path"
    query = UriResolverInterface
    uri = Uri("w3/some-uri")

    assert await query.try_resolve_uri(ClientTest(apis).invoke, api, uri)
    assert await query.get_file(ClientTest(apis).invoke, file, path)


async def test_works_typical():
    result = await resolve_uri(Uri("ens/test.eth"), uri_resolvers, ClientTest(apis, plugins, interfaces), {})

    assert result.api

    api_identity = await result.api.invoke(InvokeApiOptions(None, None), Client())

    assert api_identity.data == {
        "uri": Uri("ipfs/QmHash"),
        "manifest": Web3ApiManifest(format="0.0.1-prealpha.9", name=None, language=None, schema=None),
        "uri_resolver": "w3://ens/ipfs",
    }


async def test_uses_plugin_implements_uri_resolver():
    result = await resolve_uri(Uri("my/something-different"), uri_resolvers, ClientTest(apis, plugins, interfaces), {})

    assert result.api

    api_identity = await result.api.invoke(InvokeApiOptions(None, None), Client())

    assert api_identity.data == {
        "uri": Uri("my/something-different"),
        "manifest": Web3ApiManifest(format="0.0.1-prealpha.9", name=None, language=None, schema=None),
        "uri_resolver": "w3://ens/my-plugin",
    }


""" TODO: POL-28 Tests manifest value
async def test_works_direct_query_web3api_implements_uri_resolver():
    result = await resolve_uri(
        Uri("ens/ens"),
        uri_resolvers,
        ClientTest(apis, plugins, interfaces),
        {}
    )

    assert result.api

    api_identity = await result.api.invoke(
        InvokeApiOptions(None, None),
        Client()
    )

    assert api_identity.data == {
        "uri": Uri("ipfs/QmHash"),
        "manifest": Web3ApiManifest(
            format="0.0.1-prealpha.9",
            dog="cat",
            name=None,
            language=None,
            schema=None
        ),
        "uri_resolver": "w3://ens/ipfs"
    }
"""


async def test_works_direct_query_a_plugin_web3api_implements_uri_resolver():
    result = await resolve_uri(Uri("my/something-different"), uri_resolvers, ClientTest(apis, plugins, interfaces), {})

    assert result.api

    api_identity = await result.api.invoke(InvokeApiOptions(None, None), Client())

    assert api_identity.data == {
        "uri": Uri("my/something-different"),
        "manifest": Web3ApiManifest(format="0.0.1-prealpha.9", name=None, language=None, schema=None),
        "uri_resolver": "w3://ens/my-plugin",
    }


async def test_error_when_circular_redirect_loop():
    expected = "Infinite loop while resolving URI"
    with pytest.raises(ValueError, match=expected):
        circular = [
            UriRedirect(from_uri=Uri("some/api"), to_uri=Uri("ens/api")),
            UriRedirect(from_uri=Uri("ens/api"), to_uri=Uri("some/api")),
        ]

        await resolve_uri(Uri("some/api"), uri_resolvers, ClientTest(apis, plugins, interfaces, circular), {})


async def test_throw_when_redirect_missing_from_property():
    expected = "Redirect missing the from_uri property.\nEncountered while resolving w3://some/api"
    with pytest.raises(ValueError, match=expected):
        missing_from_property = [
            UriRedirect(from_uri=Uri("some/api"), to_uri=Uri("ens/api")),
            UriRedirect(from_uri=None, to_uri=Uri("another/api")),
        ]

        await resolve_uri(
            Uri("some/api"), uri_resolvers, ClientTest(apis, plugins, interfaces, missing_from_property), {}
        )


async def test_works_when_web3api_registers_plugin():
    plugin_registrations = list(plugins)
    plugin_registrations += [
        PluginRegistration(
            uri=Uri("some/api"),
            plugin=PluginPackageTest(
                manifest={
                    "schema": "",
                    "implements": [CoreInterfaceUris.uri_resolver],
                },
            ),
        )
    ]

    result = await resolve_uri(Uri("some/api"), uri_resolvers, ClientTest(apis, plugin_registrations, interfaces), {})

    assert result.api


async def test_return_uri_when_not_resolved_to_api():
    def try_resolve_uri(input: Dict[str, str], _client: Client):
        return {"manifest": None}

    faulty_ipfs_api = {"try_resolve_uri": try_resolve_uri}
    uri = Uri("some/api")
    apis_copy = dict(apis)
    apis_copy["w3://ens/ipfs"] = faulty_ipfs_api
    result = await resolve_uri(uri, uri_resolvers, ClientTest(apis_copy, plugins, interfaces), {})

    assert result.uri == uri
    assert not result.api
    assert not result.error
