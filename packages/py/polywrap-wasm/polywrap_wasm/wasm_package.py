from polywrap_core import Wrapper
from .wasm_wrapper import WasmWrapper
from .file_reader import IFileReader

class FileReader(IFileReader):
    def read_file(self, file_path: str) -> bytearray:
        pass

class WasmPackage():
    def create_wrapper(self) -> Wrapper:
        file_reader = FileReader()
        return WasmWrapper(file_reader)