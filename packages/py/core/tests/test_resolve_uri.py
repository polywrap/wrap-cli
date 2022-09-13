"""FIXME: Need to fix the tests"""
from __future__ import annotations

from typing import Dict, List, Optional, Union

from core import (
    AnyWrapManifest,
    Client,
    Env,
    GetFileOptions,
    GetManifestOptions,
    InterfaceImplementations,
    InvocableResult,
    InvokeOptions,
    Invoker,
    PluginModule,
    PluginPackage,
    PluginRegistration,
    Subscription,
    Uri,
    UriRedirect,
    WrapManifest,
    WrapManifestType,
    Wrapper,
    GetRedirectsOptions,
    GetPluginsOptions,
    GetInterfacesOptions,
    GetEnvsOptions,
    GetUriResolversOptions,
    UriResolver,
    GetSchemaOptions,
    GetImplementationsOptions,
    ResolveUriOptions,
    ResolveUriResult,
    LoadUriResolversResult,
    QueryResult,
    SubscribeOptions,
    PluginPackageManifest,
    CoreInterfaceUris,
    QueryOptions,
    # RedirectsResolver,
    # PluginResolver,
    # ExtendableUriResolver,
    # DeserializeManifestOptions,
    # UriResolverInterface
)


class WasmWrapperTest(Wrapper):
    def __init__(
        self,
        uri: Uri,
        manifest: WrapManifest,
        uri_resolver: str,
    ):
        self.uri = uri
        self.manifest = manifest
        self.uri_resolver = uri_resolver

    async def invoke(self, options: InvokeOptions, invoker: Invoker) -> InvocableResult:
        return InvocableResult(data={"uri": self.uri, "manifest": self.manifest, "uri_resolver": self.uri_resolver})

    async def get_schema(self, client: Client) -> str:
        return ""

    async def get_manifest(self, options: GetManifestOptions, client: Client) -> AnyWrapManifest:
        return AnyWrapManifest(version="0.1.0", type=WrapManifestType.WASM, name="test", abi=None)

    async def get_file(self, options: GetFileOptions, client: Client) -> Union[bytearray, str]:
        return ""


class PluginWrapperTest(Wrapper):
    def __init__(self, uri: Uri, plugin: PluginPackage, environment: Optional[Env] = None):
        self.uri = uri
        self.plugin = plugin
        self.environment = environment

    async def invoke(self, options: InvokeOptions, invoker: Invoker) -> InvocableResult:
        return InvocableResult(
            data={
                "uri": self.uri,
                "plugin": self.plugin,
            }
        )

    async def get_schema(self, client: Client) -> str:
        return ""

    async def get_manifest(self, options: GetManifestOptions, client: Client) -> AnyWrapManifest:
        return AnyWrapManifest(version="0.1.0", type=WrapManifestType.WASM, name="test", abi=None)

    async def get_file(self, options: GetFileOptions, client: Client) -> Union[bytearray, str]:
        return ""


class SubscriptionTest(Subscription):
    frequency: int
    is_active: bool

    def stop(self):
        return None


class ClientTest(Client):
    def __init__(
        self,
        wrappers: Dict[str, PluginModule],
        plugins: List[PluginRegistration] = [],
        interfaces: List[InterfaceImplementations] = [],
        redirects: List[UriRedirect] = [],
    ):
        self.wrappers = wrappers
        self.plugins = plugins
        self.interfaces = interfaces
        self.redirects = redirects

    async def invoke(self, options: InvokeOptions) -> InvocableResult:
        uri = options.uri
        if not self.wrappers.get(uri.uri) or not options.args:
            return InvocableResult()
        return InvocableResult(data=self.wrappers[uri.uri].get_method(options.method)(options.args, self))

    def get_redirects(self, options: Optional[GetRedirectsOptions] = None) -> List[UriRedirect]:
        return self.redirects

    def get_plugins(self, options: Optional[GetPluginsOptions] = None) -> List[PluginRegistration]:
        return self.plugins

    def get_interfaces(self, options: Optional[GetInterfacesOptions] = None) -> List[InterfaceImplementations]:
        return self.interfaces

    def get_env_by_uri(self, uri: Union[Uri, str], options: Optional[GetEnvsOptions] = None) -> Union[Env, None]:
        return None

    def get_uri_resolvers(self, options: Optional[GetUriResolversOptions] = None) -> List[UriResolver]:
        return []

    async def get_schema(self, uri: Union[Uri, str], options: Optional[GetSchemaOptions] = None) -> str:
        return ""

    async def get_manifest(self, uri: Uri, options: Optional[GetManifestOptions] = None) -> AnyWrapManifest:
        return AnyWrapManifest(version="0.1.0", type=WrapManifestType.WASM, name="test", abi=None)

    async def get_file(self, uri: Uri, options: Optional[GetFileOptions] = None) -> Union[bytes, str]:
        return ""

    def get_implementations(self, uri: Uri, options: Optional[GetImplementationsOptions] = None) -> List[Uri]:
        return [uri]

    async def resolve_uri(
        self, uri: Uri, options: Optional[ResolveUriOptions] = None
    ) -> ResolveUriResult:
        raise NotImplementedError

    def load_uri_resolvers(self) -> LoadUriResolversResult:
        raise NotImplementedError

    async def query(self, options: QueryOptions) -> QueryResult:
        return QueryResult(
            data={
                "foo": "foo",
            }
        )

    def subscribe(self, options: SubscribeOptions) -> Subscription:
        return SubscriptionTest(
            frequency=0,
            is_active=False,
        )


def ens_wrapper(input: Dict[str, str], _client: Client):
    return {"uri": "ipfs/QmHash" if input["authority"] == "ens" else None}


def ipfs_wrapper(input: Dict[str, str], _client: Client):
    return {"manifest": "format: 0.0.1-prealpha.9\ndog: cat" if input["authority"] == "ipfs" else None}


def plugin_wrapper(input: Dict[str, str], _client: Client):
    return {"manifest": "format: 0.0.1-prealpha.9" if input["authority"] == "my" else None}


class PluginPackageTest(PluginPackage):
    def __init__(self, manifest: PluginPackageManifest):
        self.manifest = manifest

    def factory(self) -> PluginModule:
        return PluginModule({})


plugins = [
    PluginRegistration(
        uri=Uri("ens/my-plugin"),
        plugin=PluginPackageTest(
            manifest=PluginPackageManifest(schema="", implements=[CoreInterfaceUris.uri_resolver.value])
        ),
    ),
]

interfaces = [
    InterfaceImplementations(
        interface=CoreInterfaceUris.uri_resolver.value,
        implementations=[
            Uri("ens/ens"),
            Uri("ens/ipfs"),
            Uri("ens/my-plugin"),
        ],
    )
]

# wrappers: Dict[str, PluginModule] = {
#     "w3://ens/ens": ens_wrapper,
#     "w3://ens/ipfs": ipfs_wrapper,
#     "w3://ens/my-plugin": plugin_wrapper,
# }


# def create_plugin_wrapper(uri: Uri, plugin: PluginPackage, environment: Optional[Env] = None) -> PluginWrapperTest:
#     return PluginWrapperTest(uri, plugin, environment)


# def create_extendable_uri_resolver(
#     uri: Uri, manifest: WrapManifest, uri_resolver: str, environment: Optional[Env] = None
# ) -> WasmWrapperTest:
#     return WasmWrapperTest(uri, manifest, uri_resolver)


# uri_resolvers = [
#     RedirectsResolver(),
#     PluginResolver(create_plugin_wrapper),
#     ExtendableUriResolver(create_extendable_uri_resolver, DeserializeManifestOptions(no_validate=True), True),
# ]

# ens_api


# async def test_sanity_resolve_uri():
#     wrapper = Uri("wrap://ens/ens")
#     file = Uri("wrap/some-file")
#     path = "wrap/some-path"
#     module = UriResolverInterface
#     uri = Uri("wrap/some-uri")

#     assert await module.try_resolve_uri(ClientTest(wrappers).invoke, api, uri)
#     assert await query.get_file(ClientTest(apis).invoke, file, path)


# async def test_works_typical():
#     result = await resolve_uri(Uri("ens/test.eth"), uri_resolvers, ClientTest(apis, plugins, interfaces), {})

#     assert result.api

#     api_identity = await result.api.invoke(InvokeApiOptions(None, None), Client())

#     assert api_identity.data == {
#         "uri": Uri("ipfs/QmHash"),
#         "manifest": Web3ApiManifest(format="0.0.1-prealpha.9", name=None, language=None, schema=None),
#         "uri_resolver": "w3://ens/ipfs",
#     }


# async def test_uses_plugin_implements_uri_resolver():
#     result = await resolve_uri(Uri("my/something-different"), uri_resolvers, ClientTest(apis, plugins, interfaces), {})

#     assert result.api

#     api_identity = await result.api.invoke(InvokeApiOptions(None, None), Client())

#     assert api_identity.data == {
#         "uri": Uri("my/something-different"),
#         "manifest": Web3ApiManifest(format="0.0.1-prealpha.9", name=None, language=None, schema=None),
#         "uri_resolver": "w3://ens/my-plugin",
#     }


# """ TODO: POL-28 Tests manifest value
# async def test_works_direct_query_web3api_implements_uri_resolver():
#     result = await resolve_uri(
#         Uri("ens/ens"),
#         uri_resolvers,
#         ClientTest(apis, plugins, interfaces),
#         {}
#     )

#     assert result.api

#     api_identity = await result.api.invoke(
#         InvokeApiOptions(None, None),
#         Client()
#     )

#     assert api_identity.data == {
#         "uri": Uri("ipfs/QmHash"),
#         "manifest": Web3ApiManifest(
#             format="0.0.1-prealpha.9",
#             dog="cat",
#             name=None,
#             language=None,
#             schema=None
#         ),
#         "uri_resolver": "w3://ens/ipfs"
#     }
# """


# async def test_works_direct_query_a_plugin_web3api_implements_uri_resolver():
#     result = await resolve_uri(Uri("my/something-different"), uri_resolvers, ClientTest(apis, plugins, interfaces), {})

#     assert result.api

#     api_identity = await result.api.invoke(InvokeApiOptions(None, None), Client())

#     assert api_identity.data == {
#         "uri": Uri("my/something-different"),
#         "manifest": Web3ApiManifest(format="0.0.1-prealpha.9", name=None, language=None, schema=None),
#         "uri_resolver": "w3://ens/my-plugin",
#     }


# async def test_error_when_circular_redirect_loop():
#     expected = "Infinite loop while resolving URI"
#     with pytest.raises(ValueError, match=expected):
#         circular = [
#             UriRedirect(from_uri=Uri("some/api"), to_uri=Uri("ens/api")),
#             UriRedirect(from_uri=Uri("ens/api"), to_uri=Uri("some/api")),
#         ]

#         await resolve_uri(Uri("some/api"), uri_resolvers, ClientTest(apis, plugins, interfaces, circular), {})


# async def test_throw_when_redirect_missing_from_property():
#     expected = "Redirect missing the from_uri property.\nEncountered while resolving w3://some/api"
#     with pytest.raises(ValueError, match=expected):
#         missing_from_property = [
#             UriRedirect(from_uri=Uri("some/api"), to_uri=Uri("ens/api")),
#             UriRedirect(from_uri=None, to_uri=Uri("another/api")),
#         ]

#         await resolve_uri(
#             Uri("some/api"), uri_resolvers, ClientTest(apis, plugins, interfaces, missing_from_property), {}
#         )


# async def test_works_when_web3api_registers_plugin():
#     plugin_registrations = list(plugins)
#     plugin_registrations += [
#         PluginRegistration(
#             uri=Uri("some/api"),
#             plugin=PluginPackageTest(
#                 manifest={
#                     "schema": "",
#                     "implements": [CoreInterfaceUris.uri_resolver.value],
#                 },
#             ),
#         )
#     ]

#     result = await resolve_uri(Uri("some/api"), uri_resolvers, ClientTest(apis, plugin_registrations, interfaces), {})

#     assert result.api


# async def test_return_uri_when_not_resolved_to_api():
#     def try_resolve_uri(input: Dict[str, str], _client: Client):
#         return {"manifest": None}

#     faulty_ipfs_api = {"try_resolve_uri": try_resolve_uri}
#     uri = Uri("some/api")
#     apis_copy = dict(apis)
#     apis_copy["w3://ens/ipfs"] = faulty_ipfs_api
#     result = await resolve_uri(uri, uri_resolvers, ClientTest(apis_copy, plugins, interfaces), {})

#     assert result.uri == uri
#     assert not result.api
#     assert not result.error
