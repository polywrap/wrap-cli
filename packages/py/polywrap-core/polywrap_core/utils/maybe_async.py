from __future__ import annotations

import inspect
from typing import Any, Awaitable, Callable, Optional, Union
import asyncio


def is_coroutine(test: Optional[Union[Awaitable[Any], Any]] = None) -> bool:
    return test is not None and inspect.iscoroutine(test)


async def execute_maybe_async_function(func: Callable[..., Any], *args: Any) -> Any:
    print(f'{type(func)=}')
    print(f'{args=}')
    print([e for e in args])
    if is_coroutine(func):
        print('!! found a coroutine')
        return await func(*args)
    else:
        print('!! this is not a  a coroutine')
        print(func)
        return func(*args)
