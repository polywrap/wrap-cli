from __future__ import annotations

from abc import ABC, abstractmethod
from ..invoke import InvokeOptions, InvokeResult, InvocableResult


class Invoker(ABC):
    @abstractmethod
    async def invoke(self, options: InvokeOptions) -> InvokeResult:
        pass


class Invocable(ABC):
    @abstractmethod
    async def invoke(self, options: InvokeOptions, invoker: Invoker) -> InvocableResult:
        pass
