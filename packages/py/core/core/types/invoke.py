from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Awaitable, Dict, Optional, Union

from . import ClientConfig, Uri


@dataclass(slots=True, kw_only=True)
class InvokeOptions:
    """
    Options required for a wrapper invocation.

    Args:
        uri: Uri of the wrapper
        method: Method to be executed
        args: Arguments for the method, structured as a dictionary
        config: Override the client's config for all invokes within this invoke.
        context_id: Invoke id used to track query context data set internally.
    """

    uri: Uri
    method: str
    args: Optional[Union[Dict[str, Any], bytes]] = field(default_factory=dict)
    config: Optional[ClientConfig] = None
    context_id: Optional[str] = None


@dataclass(slots=True, kw_only=True)(kw_only=True)
class InvokeResult:
    """
    Result of a wrapper invocation

    Args:
        data: Invoke result data. The type of this value is the return type of the method.
        error: Error encountered during the invocation.
    """

    data: Optional[Any] = None
    error: Optional[Exception] = None


@dataclass(slots=True, kw_only=True)
class InvokerOptions(InvokeOptions):
    encode_result: Optional[bool] = False


class Invoker(ABC):
    @abstractmethod
    async def invoke(self, options: InvokeOptions) -> Awaitable[InvokeResult]:
        pass


@dataclass(slots=True, kw_only=True)
class InvocableResult(InvokeResult):
    encoded: Optional[bool] = False


class Invocable(ABC):
    @abstractmethod
    async def invoke(self, options: InvokeOptions, invoker: Invoker) -> Awaitable[InvocableResult]:
        pass
