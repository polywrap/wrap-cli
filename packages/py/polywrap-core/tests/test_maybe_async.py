import inspect

import pytest
import asyncio
from polywrap_core import execute_maybe_async_function, is_coroutine

# Passing Tests

@pytest.mark.asyncio
def test_maybeasync_sanity_function_is_coroutine_works_for_coroutines(awaitable_function):
    assert is_coroutine(awaitable_function)

@pytest.mark.asyncio
def test_maybeasync_sanity_function_is_coroutine_works_for_normal_functions(normal_test_function):
    assert is_coroutine(normal_test_function) == False

# Experimental Tests
# Todo Lists 
# [x] test_maybeasync_sanity_function_is_coroutine_works_for_coroutines
# [x] test_maybeasync_sanity_function_is_coroutine_works_for_normal_functions
# [wip] test_maybeasync_asyncs_awaits_and_executes_coroutines_correctly
# [ ] test_maybeasync_asyncs_awaits_and_executes_normal_functions_correctly

# [ ] test_maybeasync_asyncs_and_awaits_coroutines_from_class_instances
# [ ] test_maybeasync_asyncs_and_awaits_normal_functions_from_class_instances
# [ ] test_maybeasync_can_handle_several_coroutines ayncio.gather(*tasks)
# [ ] confirm if test_asyncio.create_task() is needed for concurrent tasks

@pytest.mark.asyncio
async def test_maybeasync_asyncs_awaits_and_executes_coroutines_correctly(awaitable_function):
    """ 
    The MaybeAsync module should receive a coroutine as input, along with its positional arguments
    The output should be awaited and returned
    """

    print(f'this should be a coroutine{type(awaitable_function)}')
    results = execute_maybe_async_function(awaitable_function)
    print(f'this should be a coroutine{type(awaitable_function)}')
    print()
    assert False

@pytest.mark.asyncio
async def test_maybeasync_asyncs_awaits_and_executes_normal_functions_correctly(normal_test_function):
    """ 
    The MaybeAsync module should receive a normal function as input, along with its positional arguments
    The output should be awaited and returned
    """
    results  = await execute_maybe_async_function(normal_test_function)
    print('normal func results: ', results)
    assert False


@pytest.mark.asyncio
async def test_legacy_sanity(normal_test_function):

    async def test_function_return_promise():
        pass

    # test_function_resp = execute_maybe_async_function(awaitable_function)
    test_function_return_promise_resp = execute_maybe_async_function(test_function_return_promise)
    # assert inspect.iscoroutine(test_function_resp)
    assert inspect.iscoroutine(test_function_return_promise_resp)
    # await test_function_resp
    await test_function_return_promise_resp


# Tests

@pytest.mark.asyncio
async def test_asyncio_can_sleep_with_await(async_await_sleeping):
    rested: bool = async_await_sleeping
    assert rested == True

# @pytest.mark.asyncio
# async def test_maybeasync_can_inspect_coroutines(awaitable_function):
#     print(awaitable_function)
#     print(type(awaitable_function))
#     test_coroutine_resp: bool = is_coroutine(awaitable_function)
#     assert test_coroutine_resp

# @pytest.mark.asyncio
# async def test_maybeasync_executes_non_coroutines(coroutine):   
#     pass 


class ClassInstance():
    async def native_awaitable_function():
        return await asyncio.sleep(1)