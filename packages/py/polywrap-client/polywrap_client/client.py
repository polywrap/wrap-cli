from __future__ import annotations
from dataclasses import dataclass
from typing import Any, List, Optional, Union

from result import Result, Ok, Err

from polywrap_core import (
    Client,
    ClientConfig,
    Uri,
    InvokeResult,
    IUriResolutionContext,
    UriResolutionContext,
    UriPackageOrWrapper,
    Wrapper,
    InvokerOptions,
    UriPackage,
    GetFileOptions,
    TryResolveUriOptions,
    GetUriResolversOptions,
    IUriResolver,
    GetEnvsOptions,
    Env,
)

from polywrap_uri_resolvers import FsUriResolver, SimpleFileReader
from polywrap_msgpack import msgpack_decode, msgpack_encode


@dataclass(slots=True, kw_only=True)
class PolywrapClientConfig(ClientConfig):
    pass


class PolywrapClient(Client):
    _config: PolywrapClientConfig

    def __init__(self, config: Optional[PolywrapClientConfig] = None):
        # TODO: this is naive solution need to use polywrap-client-config-builder once we have it
        self._config = config or PolywrapClientConfig(
            resolver=FsUriResolver(file_reader=SimpleFileReader())
        )

    def getConfig(self):
        return self._config

    def get_uri_resolver(
        self, options: Optional[GetUriResolversOptions] = None
    ) -> IUriResolver:
        return self._config.resolver

    def get_envs(self, options: Optional[GetEnvsOptions] = None) -> List[Env]:
        return self._config.envs

    def get_env_by_uri(
        self, uri: Uri, options: Optional[GetEnvsOptions] = None
    ) -> Union[Env, None]:
        return next(filter(lambda env: env.uri == uri, self.get_envs()), None)

    async def get_file(self, uri: Uri, options: GetFileOptions) -> Union[bytes, str]:
        loaded_wrapper = (await self.load_wrapper(uri)).unwrap()
        return await loaded_wrapper.get_file(options=options, client=self)

    async def try_resolve_uri(
        self, options: TryResolveUriOptions
    ) -> Result[UriPackageOrWrapper, Exception]:
        uri = options.uri
        uri_resolver = self._config.resolver
        resolution_context = options.resolution_context or UriResolutionContext()

        return await uri_resolver.try_resolve_uri(uri, self, resolution_context)

    async def load_wrapper(
        self, uri: Uri, resolution_context: Optional[IUriResolutionContext] = None
    ) -> Result[Wrapper, Exception]:
        resolution_context = resolution_context or UriResolutionContext()

        result = await self.try_resolve_uri(
            TryResolveUriOptions(uri=uri, resolution_context=resolution_context)
        )

        if result.is_ok is True and result.ok is None:
            # FIXME: add other info
            return Err(RuntimeError(f'Error resolving URI "{uri.uri}"'))
        if result.is_err is True:
            return Err(result.unwrap_err())

        uri_package_or_wrapper = result.unwrap()

        if isinstance(uri_package_or_wrapper, Uri):
            return Err(Exception(f'Error resolving URI "{uri.uri}"\nURI not found'))

        if isinstance(uri_package_or_wrapper, UriPackage):
            return Ok(uri_package_or_wrapper.package.create_wrapper())

        return Ok(uri_package_or_wrapper.wrapper)

    async def invoke(self, options: InvokerOptions) -> InvokeResult:
        try:
            resolution_context = options.resolution_context or UriResolutionContext()
            wrapper = (
                await self.load_wrapper(
                    options.uri, resolution_context=resolution_context
                )
            ).unwrap()

            result = await wrapper.invoke(options, invoker=self)
            if options.encode_result and not result.encoded:
                encoded = msgpack_encode(result.result)
                return InvokeResult(result=encoded, error=None)
            elif not options.encode_result and result.encoded and isinstance(result.result, (bytes, bytearray)):
                decoded: Any = msgpack_decode(result.result)
                return InvokeResult(result=decoded, error=None)
            else:
                return result

        except Exception as e:
            return InvokeResult(result=None, error=e)
