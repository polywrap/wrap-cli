from __future__ import annotations
import inspect
from typing import Awaitable, Optional, Union, Any, Callable


def is_promise(test: Optional[Union[Awaitable, Any]] = None) -> bool:
    return test and inspect.iscoroutine(test)


async def execute_maybe_async_function(func: Callable, *args: Any) -> Any:
    if args:
        result = func(args)
    else:
        result = func()
    if is_promise(result):
        result = await result
    return result
