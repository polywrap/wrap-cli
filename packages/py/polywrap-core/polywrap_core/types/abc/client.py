from abc import abstractmethod
from typing import List, Optional, Union

from .invoke import Invoker
from .uri_resolver import UriResolverHandler

from ..client import GetEnvsOptions, GetUriResolversOptions, GetFileOptions
from ..uri import Uri
from ..env import Env
from ...uri_resolution.abc import IUriResolver


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

    @abstractmethod
    async def get_file(self, uri: Uri, options: Optional[GetFileOptions] = None) -> Union[bytes, str]:
        pass
