from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Union, Awaitable


class Api(ABC):
    """
    The API definition, which can be used to spawn many invocations of this particular API.

    Internally this class may do things like caching WASM bytecode, spawning worker threads, or indexing into resolvers to find the requested method.
    """

    @classmethod
    @abstractmethod
    def invoke(cls, options: InvokeApiOptions, client: Client) -> Awaitable[InvokeApiResult]:
        """
        Invoke the API based on the provided [InvokeApiOptions].

        This client will be used for any sub-queries that occur.

        :param InvokeApiOptions options: Options for this invocation
        :param Client client: The client instance requesting this invocation
        """
        return

    @classmethod
    @abstractmethod
    async def get_schema(cls, client: Client) -> Awaitable[str]:
        """
        Get the API's schema.

        :param Client client: the client instance the schema
        """
        return

    @classmethod
    @abstractmethod
    async def get_manifest(cls, options: GetManifestOptions, client: Client) -> Awaitable[AnyManifestArtifact]:
        """
        Get the API's manifest.

        :param GetManifestOptions options: Configuration options for manifest retrieval.
        :param Client client: The client instance requesting the manifest.
        """
        return

    @classmethod
    @abstractmethod
    async def get_file(cls, options: GetFileOptions, client: Client) -> Awaitable[Union[bytearray, str]]:
        """
        Get a file from the API package.

        Not implemented for plugin APIs.

        :param GetFileOptions options: Configuration options for file retrieval
        :param Client client: The client instance requesting the file
        """
        return
