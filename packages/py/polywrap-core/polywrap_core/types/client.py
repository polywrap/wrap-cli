from __future__ import annotations
from abc import abstractmethod

from dataclasses import dataclass, field
from .uri import Uri
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
    resolver: List["IUriResolver"]
    envs: List[Env] = field(default_factory=list)


@dataclass(slots=True, kw_only=True)
class GetEnvsOptions:
    pass


@dataclass(slots=True, kw_only=True)
class GetUriResolversOptions:
    pass
