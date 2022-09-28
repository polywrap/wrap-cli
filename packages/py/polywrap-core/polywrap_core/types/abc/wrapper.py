from abc import abstractmethod
from typing import Dict
from .invoke import Invocable, InvocableResult, InvokeOptions, Invoker


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


WrapperCache = Dict[str, Wrapper]
