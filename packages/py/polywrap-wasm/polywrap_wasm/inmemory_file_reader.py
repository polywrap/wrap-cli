from polywrap_core import IFileReader

from .constants import WRAP_MODULE_PATH


class InMemoryFileReader(IFileReader):
    _wasm_module: bytearray
    _base_file_reader: IFileReader

    def __init__(self, wasm_module: bytearray, base_file_reader: IFileReader):
        self._wasm_module = wasm_module
        self._base_file_reader = base_file_reader

    async def read_file(self, file_path: str) -> bytearray:
        if file_path == WRAP_MODULE_PATH:
            return self._wasm_module
        else:
            return await self._base_file_reader.read_file(file_path=file_path)
