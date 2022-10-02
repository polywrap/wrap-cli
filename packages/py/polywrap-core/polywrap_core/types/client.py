from __future__ import annotations
from abc import abstractmethod

from dataclasses import dataclass, field
from typing import TYPE_CHECKING, List, Optional, Union

from .env import Env
from .uri import Uri
from .invoke import Invoker
from .uri_resolver import UriResolverHandler

if TYPE_CHECKING:
    from ..uri_resolution.abc import IUriResolver

class Client(Invoker, UriResolverHandler):
    @abstractmethod
    def get_envs(self, options: Optional[GetEnvsOptions] = None) -> List[Env]:
        pass

    @abstractmethod
    def get_env_by_uri(self, uri: Uri, options: Optional[GetEnvsOptions] = None) -> Union[Env, None]:
        pass

    @abstractmethod
    def get_uri_resolver(self, options: Optional[GetUriResolversOptions] = None) -> List[IUriResolver]:
        pass


@dataclass(slots=True, kw_only=True)
class ClientConfig:
    envs: List[Env] = field(default_factory=list)
    resolver: List["IUriResolver"]


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
