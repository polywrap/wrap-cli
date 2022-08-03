import inspect

import pytest

from .. import execute_maybe_async_function, is_promise


@pytest.mark.asyncio
async def test_sanity():
    async def promise():
        return ""

    def test_function():
        return ""

    async def test_function_return_promise():
        return ""

    test_promise_resp = promise()
    test_function_resp = execute_maybe_async_function(test_function)
    test_function_return_promise_resp = execute_maybe_async_function(test_function_return_promise)
    assert is_promise(test_promise_resp)
    assert inspect.iscoroutine(test_function_resp)
    assert inspect.iscoroutine(test_function_return_promise_resp)
    await test_promise_resp
    await test_function_resp
    await test_function_return_promise_resp
