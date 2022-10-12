import pytest

from pathlib import Path

from polywrap_msgpack import msgpack_decode
from polywrap_core import Uri, InvokeOptions
from polywrap_wasm import IFileReader, WasmWrapper, WRAP_MODULE_PATH


@pytest.fixture
def wrap_module():
    wrap_path = Path(__file__).parent / "cases" / "wrap.wasm"
    with open(wrap_path, "rb") as f:
        yield bytearray(f.read())


@pytest.fixture
def dummy_file_reader():
    class FileReader(IFileReader):
        async def read_file(self, file_path: str) -> bytearray:
            return bytearray()

    yield FileReader()


@pytest.fixture
def simple_file_reader(wrap_module: bytearray):
    class FileReader(IFileReader):
        async def read_file(self, file_path: str) -> bytearray:
            if file_path == WRAP_MODULE_PATH:
                return wrap_module
            raise FileNotFoundError(file_path)

    yield FileReader()


@pytest.mark.asyncio
async def test_invoke_with_given_wrap_module(
    dummy_file_reader: IFileReader, wrap_module: bytearray
):
    wrapper = WasmWrapper(dummy_file_reader, wrap_module)

    message = "hey"
    args = {"arg": message}
    options = InvokeOptions(uri=Uri("fs/./build"), method="simpleMethod", args=args)
    result = await wrapper.invoke(options)
    assert msgpack_decode(result.result) == message  # type: ignore


@pytest.mark.asyncio
async def test_invoke_with_file_reader(simple_file_reader: IFileReader):
    wrapper = WasmWrapper(simple_file_reader)

    message = "hey"
    args = {"arg": message}
    options = InvokeOptions(uri=Uri("fs/./build"), method="simpleMethod", args=args)
    result = await wrapper.invoke(options)
    assert msgpack_decode(result.result) == message  # type: ignore
