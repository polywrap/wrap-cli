from __future__ import annotations
import inspect
from typing import Awaitable, Optional, Union, Any, Callable, Dict


def is_promise(test: Optional[Union[Awaitable, Any]]=None) -> bool:
    return test and inspect.iscoroutine(test)


def proxy_get(obj: Dict[str, Any], transform: Callable) -> Dict[str, Any]:
    new_obj = {}
    for key in obj:
        new_obj[key] = transform(obj[key], key)
    return new_obj


def index_of_array(source: List[int], search: List[int]) -> int:
    run = True
    start = 0
    while run:
        idx = source[start:].index(search[0])

        # not found
        if idx < start:
            run = False
            continue

        # Make sure the rest of the subarray contains the search pattern
        sub_buff = source[idx:idx + len(search)]

        retry = False
        i = 1
        for i in range(len(search)):
            if sub_buff[i] != search[i]:
                retry = True
                break

        if retry:
            start = idx + i
            continue
        else:
            return idx

    return -1
