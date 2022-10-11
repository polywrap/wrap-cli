import inspect
import pytest
import asyncio
from polywrap_core import execute_maybe_async_function, is_coroutine

# Todo Lists 

# [wip] deprecate test_legacy_sanity
# [x] test_maybeasync_sanity_function_is_coroutine_works_for_coroutines
# [x] test_maybeasync_sanity_function_is_coroutine_works_for_normal_functions
# [wip] test_maybeasync_asyncs_awaits_and_executes_coroutines_correctly
# [wip] test_maybeasync_asyncs_awaits_and_executes_normal_functions_correctly

# [ ] test_maybeasync_asyncs_and_awaits_coroutines_from_class_instances
# [ ] test_maybeasync_asyncs_and_awaits_normal_functions_from_class_instances
# [ ] test_maybeasync_can_handle_several_coroutines ayncio.gather(*tasks)
# [ ] confirm if test_asyncio.create_task() is needed for concurrent tasks
# [ ] test_maybeasync_can_inspect_coroutines
# [ ] test_maybeasync_executes_non_coroutines


@pytest.mark.asyncio
async def test_legacy_sanity(normal_test_function):
    async def test_function_return_promise():
        pass
    # test_function_resp = execute_maybe_async_function(awaitable_function)
    
    test_function_return_promise_resp = await execute_maybe_async_function(test_function_return_promise)
    # await test_function_return_promise_resp
    # assert inspect.iscoroutine(test_function_resp)
    assert inspect.iscoroutine(test_function_return_promise_resp)
    # await test_function_resp


# @pytest.mark.asyncio
def test_maybeasync_sanity_function_is_coroutine_works_for_coroutines(awaitable_function):
    assert is_coroutine(awaitable_function)

# @pytest.mark.asyncio
def test_maybeasync_sanity_function_is_coroutine_works_for_normal_functions(normal_test_function):
    assert is_coroutine(normal_test_function) == False


@pytest.mark.asyncio
async def test_asyncio_can_sleep_with_await(async_await_sleeping):
    rested: bool = async_await_sleeping
    assert rested == True


class ClassInstance():
    async def native_awaitable_function():
        return await asyncio.sleep(1)

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
async def test_maybeasync_asyncs_awaits_and_executes_normal_functions_correctly():
    """ 
    The MaybeAsync module should receive a normal function as input, along with its positional arguments
    The output should be awaited and returned
    """

    def normal_test_echo_function(answer):
        return answer

    message = 21312
    results  = await execute_maybe_async_function(normal_test_echo_function, message)
    print('normal func results: ', results)
    assert results == message

@pytest.mark.asyncio
async def test_maybeasync_can_inspect_coroutines(awaitable_function):
    print(awaitable_function, type(awaitable_function))
    test_coroutine_resp: bool = is_coroutine(awaitable_function)
    assert test_coroutine_resp

@pytest.mark.asyncio
async def test_maybeasync_executes_non_coroutines(normal_test_function):   
    print(normal_test_function, type(normal_test_function))
    test_coroutine_resp: bool = is_coroutine(normal_test_function)
    print(f'this test_coroutine_resp should be False: {test_coroutine_resp}')
    assert test_coroutine_resp == False