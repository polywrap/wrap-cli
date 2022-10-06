
#  Polywrap Python Wasm Client
#  Core Client Pytest Fixtures

import time 
import asyncio
import pytest

@pytest.fixture
def normal_test_function():
    print('This is a normal function')
    return 'normal function' 

@pytest.fixture
def awaitable_function():
    async def wait_this_many_seconds(s):
        await asyncio.sleep(s)
    return wait_this_many_seconds(3)



@pytest.fixture
async def coroutine():
    pass

@pytest.fixture
async def async_await_sleeping():
    # Running an async coroutine function:
    rested = False
    print(f"about to sleep, at {time.strftime('%X')}")
    await asyncio.sleep(1)
    rested = True
    print(f"gm, just woke up, at {time.strftime('%X')}")
    return rested
