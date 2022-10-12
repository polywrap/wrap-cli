import inspect
from typing import Awaitable

import pytest

import asyncio
import time 
from polywrap_core.utils.maybe_async import execute_maybe_async_function, is_coroutine
# from polywrap_core import execute_maybe_async_function, is_coroutine



@pytest.mark.asyncio
async def test_sanity():
    async def coroutine():
        pass

    def test_function():
        pass

    async def test_function_return_promise():
        pass

    test_coroutine_resp = coroutine()
    assert is_coroutine(test_coroutine_resp)

    test_function_resp = execute_maybe_async_function(test_function)
    assert inspect.iscoroutine(test_function_resp)

    test_function_return_promise_resp = execute_maybe_async_function(test_function_return_promise)
    assert inspect.iscoroutine(test_function_return_promise_resp)

    await test_coroutine_resp
    await test_function_resp
    await test_function_return_promise_resp


# Fixtures

@pytest.fixture
async def awaitable_function():
    return await asyncio.sleep(1)

@pytest.fixture
async def async_await_sleeping():
    print('runing an async coroutine function:')
    rested = False
    print(f"about to sleep. finished at {time.strftime('%X')}")
    await asyncio.sleep(1)
    rested = True
    print('gm, just woke up.')
    return rested


# Tests

@pytest.mark.asyncio
async def test_asyncio_can_sleep_with_await(async_await_sleeping):
    rested: bool = async_await_sleeping
    assert rested == True

@pytest.mark.asyncio
async def test_maybeasync_can_inspect_coroutines(awaitable_function):
    print(awaitable_function)
    print(type(awaitable_function))
    test_coroutine_resp: bool = is_coroutine(awaitable_function)
    assert test_coroutine_resp

# @pytest.mark.asyncio
# async def test_maybeasync_executes_non_coroutines(coroutine):   
#     pass 