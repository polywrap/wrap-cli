from polywrap_core import Wrapper, IWrapPackage
from .wasm_wrapper import WasmWrapper
from .file_reader import IFileReader
from .inmemory_file_reader import InMemoryFileReader
from .constants import WRAP_MODULE_PATH


class WasmPackage(IWrapPackage):
    wasm_module: bytearray
    file_reader: IFileReader

    def __init__(self, wasm_module: bytearray, file_reader: IFileReader):
        self.wasm_module = wasm_module
        self.file_reader = InMemoryFileReader(wasm_module=wasm_module, base_file_reader=file_reader)

    async def get_wasm_module(self) -> bytearray:
        return await self.file_reader.read_file(WRAP_MODULE_PATH)

    def create_wrapper(self) -> Wrapper:
        return WasmWrapper(self.wasm_module, self.file_reader)