from __future__ import annotations

import inspect
from typing import Any, Awaitable, Callable, Optional, Union


def is_coroutine(test: Optional[Union[Awaitable, Any]] = None) -> bool:
    return test is not None and inspect.iscoroutine(test)


async def execute_maybe_async_function(func: Callable, *args: Any) -> Awaitable[Any]:
    if args:
        result = func(args)
    else:
        result = func()
    if is_coroutine(result):
        result = await result
    return result
