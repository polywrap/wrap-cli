from typing import Awaitable, Dict, Union

from . import Client, GetFileOptions, GetManifestOptions, Invocable, InvocableResult, InvokeOptions, Invoker


class Wrapper(Invocable):
    """
    Invoke the Wrapper based on the provided [[InvokeOptions]]

    Args:
        options: Options for this invocation.
        client: The client instance requesting this invocation. This client will be used for any sub-invokes that occur.
    """

    async def invoke(options: InvokeOptions, invoker: Invoker) -> Awaitable[InvocableResult]:
        pass

    async def get_file(options: GetFileOptions, client: Client) -> Awaitable[Union[str, bytes]]:
        pass

    async def get_manifest(options: GetManifestOptions, client: Client) -> Awaitable[WrapManifest]:
        pass

    async def get_schema(client: Client) -> Awaitable[str]:
        pass


WrapperCache = Dict[str, Wrapper]
