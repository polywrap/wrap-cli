from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Union, Optional, Awaitable, Dict, List


@dataclass
class ClientConfig:
    redirects: List[UriRedirect]
    plugins: List[PluginRegistration]
    interfaces: List[InterfaceImplementations]
    envs: List[Env]
    uri_resolvers: List[UriResolver]


@dataclass
class Contextualized:
    context_id: str


@dataclass
class GetRedirectsOptions(Contextualized):
    pass


@dataclass
class GetPluginsOptions(Contextualized):
    pass


@dataclass
class GetInterfacesOptions(Contextualized):
    pass


@dataclass
class GetSchemaOptions(Contextualized):
    pass


@dataclass
class GetEnvsOptions(Contextualized):
    pass


@dataclass
class GetUriResolversOptions(Contextualized):
    pass


@dataclass
class GetManifestOptions(Contextualized):
    type: ManifestArtifactType


@dataclass
class GetFileOptions(Contextualized):
    path: str
    encoding: str = 'utf-8'


@dataclass
class GetImplementationsOptions(Contextualized):
    apply_redirects: bool = False


class Client:
    @classmethod
    @abstractmethod
    def get_redirects(cls, options: GetRedirectsOptions) -> List[UriRedirect]:
        return

    @classmethod
    @abstractmethod
    def get_plugins(cls, options: GetPluginsOptions) -> List[PluginRegistration]:
        return

    @classmethod
    @abstractmethod
    def get_interfaces(cls, options: GetInterfacesOptions) -> List[InterfaceImplementations]:
        return

    @classmethod
    @abstractmethod
    def get_envs(cls, options: GetEnvsOptions) -> List[Env]:
        return

    @classmethod
    @abstractmethod
    def get_env_by_uri(cls, uri: Union[Uri, str], options: GetEnvsOptions) -> Union[Env, None]:
        return

    @classmethod
    @abstractmethod
    def get_uri_resolvers(cls, options: GetUriResolversOptions) -> List[UriResolver]:
        return

    @classmethod
    @abstractmethod
    async def get_schema(cls, uri: Union[Uri, str], options: GetSchemaOptions) -> Awaitable[str]:
        return

    @classmethod
    @abstractmethod
    async def get_manifest(cls, uri: Union[Uri, str], options: GetManifestOptions) -> Awaitable[ManifestArtifactType]:
        return

    @classmethod
    @abstractmethod
    async def get_file(cls, uri: Union[Uri, str], options: GetFileOptions) -> Awaitable[Union[Uri, str]]:
        return

    @classmethod
    @abstractmethod
    def get_implementations(cls, uri: Union[Uri, str], options: GetImplementationsOptions) -> List[Union[Uri, str]]:
        return

    @classmethod
    @abstractmethod
    async def resolve_uri(
        cls, uri: Union[Uri, str], options: Optional[ResolveUriOptions] = None
    ) -> Awaitable[ResolveUriResult]:
        return None

    @classmethod
    @abstractmethod
    async def load_uri_resolvers(cls) -> Awaitable[Dict[bool, List[str]]]:
        return
