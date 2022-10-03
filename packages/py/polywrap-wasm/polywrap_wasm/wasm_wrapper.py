from dataclasses import dataclass
from typing import Callable

from wasmtime import Store, Module
from polywrap_core import InvokeOptions, Wrapper, GetFileOptions
from polywrap_msgpack import msgpack_encode

from .constants import WRAP_MODULE_PATH
from .file_reader import IFileReader
from .types.state import State
from .imports import create_imports


@dataclass(slots=True, kw_only=True)
class WasmWrapper(Wrapper):
    file_reader: IFileReader
    wasm_module: str = None

    def __init__(self, file_reader: IFileReader):
        self.file_reader = file_reader

    def get_file(options: GetFileOptions):
        pass

    def get_wasm_module(self):
        self.file_reader.read_file(WRAP_MODULE_PATH)
        self.wasm_module = "./polywrap_wasm/wrap2.wasm"

        return self.wasm_module

    def create_wasm_instance(self, store: Store, state: State, abort: Callable[[str], None]):
        module = Module.from_file(store.engine, self.wasm_module)
        instance = create_imports(store, module, state, abort)
        return instance

    def invoke(self, options: InvokeOptions = None):
        self.get_wasm_module()
        state = State(invoke={}, method=options.method)
        arguments = msgpack_encode({}) if options.args is None else options.args
        state.args = arguments if isinstance(arguments, bytes) else msgpack_encode(arguments)
        state.env = msgpack_encode(options.env) if options.env else msgpack_encode({})

        method_length = len(options.method)
        args_length = len(state.args)
        env_length = len(state.env)

        # TODO: Pass all necessary args to this log
        def abort(message: str):
            print(message)
            raise BaseException(f"""
            WasmWrapper: Wasm module aborted execution
            URI:
            Method:
            Args:
            Message: {message}""")

        store = Store()
        instance = self.create_wasm_instance(store, state, abort)
        exports = instance.exports(store)
        result = exports["_wrap_invoke"](
            store,
            method_length,
            args_length,
            env_length
        )
        # TODO: Handle invoke result error
        return _process_invoke_result(state, result, abort)


def _process_invoke_result(state: State, result: int, abort: Callable[[str], None]):
    print(state)
    if result:
        if state.invoke['result']:
            return state.invoke['result']

        abort("Invoke result is missing")
    else:
        if state.invoke['error']:
            # print(state.invoke)
            raise BaseException(state.invoke['error'])

        abort("Invoke error is missing.")
