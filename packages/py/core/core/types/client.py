from __future__ import annotations

from abc import abstractmethod
from dataclasses import dataclass, field
from typing import Awaitable, List, Optional, Union

from . import (
    Env,
    InterfaceImplementations,
    Invoker,
    PluginRegistration,
    QueryHandler,
    SubscriptionHandler,
    Uri,
    UriRedirect,
    UriResolverHandler,
    WorkflowHandler,
)

from .. import UriResolver


@dataclass(slots=True, kw_only=True)
class ClientConfig:
    redirects: List[UriRedirect] = field(default_factory=list)
    plugins: List[PluginRegistration] = field(default_factory=list)
    interfaces: List[InterfaceImplementations] = field(default_factory=list)
    envs: List[Env] = field(default_factory=list)
    uri_resolvers: List[UriResolver] = field(default_factory=list)


@dataclass(slots=True, kw_only=True)
class Contextualized:
    context_id: Optional[str] = None


@dataclass(slots=True, kw_only=True)
class GetRedirectsOptions(Contextualized):
    pass


@dataclass(slots=True, kw_only=True)
class GetPluginsOptions(Contextualized):
    pass


@dataclass(slots=True, kw_only=True)
class GetInterfacesOptions(Contextualized):
    pass


@dataclass(slots=True, kw_only=True)
class GetSchemaOptions(Contextualized):
    pass


@dataclass(slots=True, kw_only=True)
class GetEnvsOptions(Contextualized):
    pass


@dataclass(slots=True, kw_only=True)
class GetUriResolversOptions(Contextualized):
    pass


@dataclass(slots=True, kw_only=True)
class GetManifestOptions(Contextualized):
    pass


@dataclass(slots=True, kw_only=True)
class GetFileOptions(Contextualized):
    path: str
    encoding: Optional[str] = "utf-8"


@dataclass(slots=True, kw_only=True)
class GetImplementationsOptions(Contextualized):
    apply_redirects: Optional[bool] = False


class Client(Invoker, QueryHandler, SubscriptionHandler, WorkflowHandler, UriResolverHandler):
    @abstractmethod
    def get_redirects(self, options: GetRedirectsOptions) -> List[UriRedirect]:
        pass

    @abstractmethod
    def get_plugins(self, options: GetPluginsOptions) -> List[PluginRegistration]:
        pass

    @abstractmethod
    def get_interfaces(self, options: GetInterfacesOptions) -> List[InterfaceImplementations]:
        pass

    @abstractmethod
    def get_envs(self, options: GetEnvsOptions) -> List[Env]:
        pass

    @abstractmethod
    def get_env_by_uri(self, uri: Uri, options: GetEnvsOptions) -> Union[Env, None]:
        pass

    @abstractmethod
    def get_uri_resolvers(self, options: GetUriResolversOptions) -> List[UriResolver]:
        pass

    @abstractmethod
    def get_implementations(self, uri: Uri, options: GetImplementationsOptions) -> List[Uri]:
        pass

    @abstractmethod
    async def get_schema(self, uri: Uri, options: GetSchemaOptions) -> Awaitable[str]:
        pass

    @abstractmethod
    async def get_manifest(self, uri: Uri, options: GetManifestOptions) -> Awaitable[WrapManifest]:
        pass

    @abstractmethod
    async def get_file(self, uri: Uri, options: GetFileOptions) -> Awaitable[Union[bytes, str]]:
        pass
