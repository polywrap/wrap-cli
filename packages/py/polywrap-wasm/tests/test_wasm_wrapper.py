import pytest

from polywrap_msgpack import msgpack_decode
from polywrap_core import Uri, InvokeOptions
from polywrap_wasm import FileReader, WasmWrapper


@pytest.mark.asyncio
async def test_invoke():
    file_reader = FileReader()
    wrapper = WasmWrapper(file_reader)
    
    message = "hey"
    args = {
        "arg": message
    }
    options = InvokeOptions(uri=Uri("fs/./build"), method="simpleMethod", args=args)
    result = await wrapper.invoke(options)
    assert msgpack_decode(result.result) == message # type: ignore
