import pytest

from pathlib import Path

from polywrap_msgpack import msgpack_decode
from polywrap_core import Uri, InvokeOptions
from polywrap_wasm import IFileReader, WasmWrapper


class FileReader(IFileReader):
    async def read_file(self, file_path: str) -> bytearray:
        return bytearray()

@pytest.fixture
def wrap_module():
    wrap_path = Path(__file__).parent / "cases" / "wrap2.wasm"
    with open(wrap_path, "rb") as f:
        yield bytearray(f.read())

@pytest.mark.asyncio
async def test_invoke(wrap_module: bytearray):
    file_reader = FileReader()
    wrapper = WasmWrapper(wrap_module, file_reader)
    
    message = "hey"
    args = {
        "arg": message
    }
    options = InvokeOptions(uri=Uri("fs/./build"), method="simpleMethod", args=args)
    result = await wrapper.invoke(options)
    assert msgpack_decode(result.result) == message # type: ignore
