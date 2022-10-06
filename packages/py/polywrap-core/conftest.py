
#  Polywrap Python Wasm Client
#  Core Client Pytest Fixtures

import time 
import asyncio
import pytest

@pytest.fixture
async def awaitable_function():
    return await asyncio.sleep(1)

@pytest.fixture
async def async_await_sleeping():
    # Running an async coroutine function:
    rested = False
    print(f"about to sleep, at {time.strftime('%X')}")
    await asyncio.sleep(1)
    rested = True
    print(f"gm, just woke up, at {time.strftime('%X')}")
    return rested
