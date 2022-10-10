from polywrap_core import Wrapper, IWrapPackage
from .wasm_wrapper import WasmWrapper
from .file_reader import IFileReader

class FileReader(IFileReader):
    async def read_file(self, file_path: str) -> bytearray:
        return bytearray()

class WasmPackage(IWrapPackage):
    file_reader: IFileReader

    def __init__(self, file_reader: IFileReader):
        self.file_reader = file_reader


    def create_wrapper(self) -> Wrapper:
        return WasmWrapper(self.file_reader)