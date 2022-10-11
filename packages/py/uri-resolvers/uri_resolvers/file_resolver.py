from polywrap_core import (
    Uri,
    IFileReader,
    IUriResolver,
    UriPackage,
    UriPackageOrWrapper,
    Client,
    IUriResolutionContext,
)
from polywrap_wasm import WasmPackage


class SimpleFileReader(IFileReader):
    async def read_file(self, file_path: str) -> bytearray:
        with open(file_path, "rb") as f:
            return bytearray(f.read())


class FileUriResolver(IUriResolver):
    file_reader: IFileReader

    def __init__(self, file_reader: IFileReader):
        self.file_reader = file_reader

    async def try_resolve_uri(
        self, uri: Uri, client: Client, resolution_context: IUriResolutionContext
    ) -> UriPackageOrWrapper:
        if uri.authority not in ["fs", "file"]:
            return uri

        wasm_module = await self.file_reader.read_file(uri.path)
        return UriPackage(
            uri=uri,
            package=WasmPackage(wasm_module=wasm_module, file_reader=self.file_reader),
        )
