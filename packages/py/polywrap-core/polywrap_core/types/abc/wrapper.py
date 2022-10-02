from abc import abstractmethod
from typing import Dict
from ..invoke import Invocable, InvocableResult, InvokeOptions, Invoker


class Wrapper(Invocable):
    """
    Invoke the Wrapper based on the provided [[InvokeOptions]]

    Args:
        options: Options for this invocation.
        client: The client instance requesting this invocation. This client will be used for any sub-invokes that occur.
    """

    @abstractmethod
    async def invoke(self, options: InvokeOptions, invoker: Invoker) -> InvocableResult:
        pass

    @abstractmethod
    async def get_file(self, options: GetFileOptions, client: Client) -> Union[str, bytes]:
        pass

    @abstractmethod
    async def get_schema(self, client: Client) -> str:
        pass


WrapperCache = Dict[str, Wrapper]
