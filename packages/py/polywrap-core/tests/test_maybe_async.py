import inspect

import pytest

from polywrap_core import execute_maybe_async_function, is_coroutine


@pytest.mark.asyncio
async def test_sanity():
    async def coroutine():
        pass

    def test_function():
        pass

    async def test_function_return_promise():
        pass

    test_coroutine_resp = coroutine()
    test_function_resp = execute_maybe_async_function(test_function)
    test_function_return_promise_resp = execute_maybe_async_function(test_function_return_promise)
    assert is_coroutine(test_coroutine_resp)
    assert inspect.iscoroutine(test_function_resp)
    assert inspect.iscoroutine(test_function_return_promise_resp)
    await test_coroutine_resp
    await test_function_resp
    await test_function_return_promise_resp
