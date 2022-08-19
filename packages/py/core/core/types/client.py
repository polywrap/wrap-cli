from __future__ import annotations

from abc import abstractmethod
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, List, Optional, Union

from .env import Env
from .interface_implementations import InterfaceImplementations
from .invoke import Invoker
from .manifest import WrapManifest
from .plugin_registration import PluginRegistration
from .query import QueryHandler
from .subscriptions import SubscriptionHandler
from .uri import Uri
from .uri_redirect import UriRedirect
from .uri_resolver import UriResolverHandler
from .workflow import WorkflowHandler

if TYPE_CHECKING:
    from ..uri_resolution import UriResolver


@dataclass(slots=True, kw_only=True)
class ClientConfig:
    redirects: List[UriRedirect] = field(default_factory=list)
    plugins: List[PluginRegistration] = field(default_factory=list)
    interfaces: List[InterfaceImplementations] = field(default_factory=list)
    envs: List[Env] = field(default_factory=list)
    uri_resolvers: List["UriResolver"] = field(default_factory=list)


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
    def get_redirects(self, options: Optional[GetRedirectsOptions] = None) -> List[UriRedirect]:
        pass

    @abstractmethod
    def get_plugins(self, options: Optional[GetPluginsOptions] = None) -> List[PluginRegistration]:
        pass

    @abstractmethod
    def get_interfaces(self, options: Optional[GetInterfacesOptions] = None) -> List[InterfaceImplementations]:
        pass

    @abstractmethod
    def get_envs(self, options: Optional[GetEnvsOptions] = None) -> List[Env]:
        pass

    @abstractmethod
    def get_env_by_uri(self, uri: Uri, options: Optional[GetEnvsOptions] = None) -> Union[Env, None]:
        pass

    @abstractmethod
    def get_uri_resolvers(self, options: Optional[GetUriResolversOptions] = None) -> List["UriResolver"]:
        pass

    @abstractmethod
    def get_implementations(self, uri: Uri, options: Optional[GetImplementationsOptions] = None) -> List[Uri]:
        pass

    @abstractmethod
    async def get_schema(self, uri: Uri, options: Optional[GetSchemaOptions] = None) -> str:
        pass

    @abstractmethod
    async def get_manifest(self, uri: Uri, options: Optional[GetManifestOptions] = None) -> WrapManifest:
        pass

    @abstractmethod
    async def get_file(self, uri: Uri, options: Optional[GetFileOptions] = None) -> Union[bytes, str]:
        pass
