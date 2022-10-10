from typing import Optional, Union

from polywrap_core import (Client, GetFileOptions, InvocableResult,
                           InvokeOptions, Invoker, Wrapper)
from polywrap_msgpack import msgpack_encode
from wasmtime import Module, Store

from .constants import WRAP_MODULE_PATH
from .errors import WasmAbortError
from .exports import WrapExports
from .file_reader import IFileReader
from .imports import create_instance
from .types.state import State


class WasmWrapper(Wrapper):
    file_reader: IFileReader
    wasm_module: bytearray

    def __init__(self, wasm_module: bytearray, file_reader: IFileReader):
        self.file_reader = file_reader
        self.wasm_module = wasm_module

    async def get_file(
        self, options: GetFileOptions, client: Client
    ) -> Union[str, bytes]:
        data = await self.file_reader.read_file(options.path)
        return data.decode(encoding=options.encoding) if options.encoding else data

    async def get_wasm_module(self) -> bytearray:
        if not self.wasm_module:
            self.wasm_module = await self.file_reader.read_file(WRAP_MODULE_PATH)
        return self.wasm_module

    def create_wasm_instance(
        self, store: Store, state: State
    ):
        if self.wasm_module:
            module = Module(store.engine, self.wasm_module)
            return create_instance(store, module, state)

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

        store = Store()
        instance = self.create_wasm_instance(store, state)
        if not instance:
            raise RuntimeError("Unable to instantiate the wasm module")
        exports = WrapExports(instance, store)

        result = exports.__wrap_invoke__(method_length, args_length, env_length)
        # TODO: Handle invoke result error
        return self._process_invoke_result(state, result)

    @staticmethod
    def _process_invoke_result(
        state: State, result: bool
    ) -> InvocableResult:
        if result and state.invoke["result"]:
            return InvocableResult(result=state.invoke["result"])
        elif result or not state.invoke["error"]:
            raise WasmAbortError("Invoke result is missing")
        else:
            # TODO: we may want better error support here
            return InvocableResult(error=Exception(state.invoke["error"]))

