from typing import Callable, Optional, Union

from wasmtime import Store, Module
from polywrap_core import (
    InvokeOptions,
    Wrapper,
    GetFileOptions,
    Client,
    Invoker,
    InvocableResult,
)
from polywrap_msgpack import msgpack_encode

from .constants import WRAP_MODULE_PATH
from .file_reader import IFileReader
from .types.state import State
from .imports import create_imports


class ExportNotFoundError(Exception):
    """ raises when an export isn't found in the wasm module """


class WasmWrapper(Wrapper):
    file_reader: IFileReader
    wasm_module: Optional[str] = None

    def __init__(self, file_reader: IFileReader):
        self.file_reader = file_reader

    async def get_file(
        self, options: GetFileOptions, client: Client
    ) -> Union[str, bytes]:
        return ""

    async def get_wasm_module(self):
        await self.file_reader.read_file(WRAP_MODULE_PATH)
        self.wasm_module = "./polywrap_wasm/wrap2.wasm"

        return self.wasm_module

    def create_wasm_instance(
        self, store: Store, state: State, abort: Callable[[str], None]
    ):
        if self.wasm_module:
            module = Module.from_file(store.engine, self.wasm_module)
            return create_imports(store, module, state, abort)

    async def invoke(
        self, options: Optional[InvokeOptions] = None, invoker: Optional[Invoker] = None
    ) -> InvocableResult:
        await self.get_wasm_module()
        state = State()
        state.method = options.method if options else ""
        arguments = options.args if options and options.args else msgpack_encode({})
        state.args = (
            arguments if isinstance(arguments, bytes) else msgpack_encode(arguments)
        )
        state.env = (
            msgpack_encode(options.env)
            if options and options.env
            else msgpack_encode({})
        )

        method_length = len(state.method)
        args_length = len(state.args)
        env_length = len(state.env)

        # TODO: Pass all necessary args to this log
        def abort(message: str):
            print(message)
            raise RuntimeError(
                f"""
            WasmWrapper: Wasm module aborted execution
            URI:
            Method:
            Args:
            Message: {message}"""
            )

        store = Store()
        instance = self.create_wasm_instance(store, state, abort)
        if not instance:
            raise RuntimeError("Unable to instantiate the wasm module")
        exports = instance.exports(store)
        _wrap_invoke = exports.get("_wrap_invoke")
        if not _wrap_invoke:
            raise ExportNotFoundError("Unable to find _wrap_invoke wasm export in the module")
        
        result = _wrap_invoke(store, method_length, args_length, env_length)
        # TODO: Handle invoke result error
        return _process_invoke_result(state, result, abort)


def _process_invoke_result(state: State, result: int, abort: Callable[[str], None]):
    if result:
        if state.invoke["result"]:
            return state.invoke["result"]

        abort("Invoke result is missing")
    else:
        if state.invoke["error"]:
            # print(state.invoke)
            raise BaseException(state.invoke["error"])

        abort("Invoke error is missing.")
