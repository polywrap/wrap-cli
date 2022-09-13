from __future__ import annotations
from dataclasses import dataclass
import logging

import wasmer
from .types import W3Imports, W3ImportsW3
from .buffer import read_bytes, read_string, write_bytes, write_string

logger = logging.getLogger()


class W3ImportW3Implementation(W3ImportsW3):
    def __init__(self, config: ImportConfig):
        self.client = config["client"]
        self.memory = config["memory"]
        self.state = config["memory"]
        self.abort = config["abort"]

    @classmethod
    async def __w3_subinvoke(
        cls,
        uri_ptr: int,
        uri_len: int,
        module_ptr: int,
        module_len: int,
        method_ptr: int,
        method_len: int,
        input_ptr: int,
        input_len: int
    ) -> bool:
        # Reset our state
        cls.state.subinvoke.result = None
        cls.state.subinvoke.error = None

        uri = read_string(cls.memory.buffer, uri_ptr, uri_len)
        method = read_string(cls.memory.buffer, method_ptr, method_len)
        input = read_bytes(cls.memory.buffer, input_ptr, input_len)

        invoke_results = await cls.client.invoke(
            InvokeApiOptions(
                uri = uri,
                method = method,
                input = input,
                no_decode = True
            )
        )

        if not invoke_results.error:
            if isinstance(invoke_results.data, bytearray):
                msgpack = invoke_results.data
            else:
                msgpack = msgpack_encode(invoke_results.data)

            cls.state.subinvoke.result = msgpack
        else:
            cls.state.subinvoke.error = f"{invoke_results.error.name}: {invoke_results.error.message}"

        return not invoke_results.error


    @classmethod
    def __w3_subinvoke_result_len(cls) -> int:
        """ Give WASM the size of the result. """
        if not cls.state.subinvoke.result:
            cls.abort("__w3_subinvoke_result_len: subinvoke.result is not set")
            return 0
        return cls.state.subinvoke.result.byteLength

    @classmethod
    def __w3_subinvoke_result(cls, ptr: int):
        """ Copy the subinvoke result into WASM. """
        if not cls.state.subinvoke.result:
            cls.abort("__w3_subinvoke_result: subinvoke.result is not set")
            return
        
        write_bytes(cls.state.subinvoke.result, cls.memory.buffer, ptr)

    @classmethod
    def __w3_subinvoke_error_len(cls) -> int:
        """ Give WASM the size of the error. """
        if not cls.state.subinvoke.error:
            cls.abort("__w3_subinvoke_error_len: subinvoke.error is not set")
            return 0
        
        return cls.state.subinvoke.error.length

    @classmethod
    def __w3_subinvoke_error(cls, ptr: int):
        """ Copy the subinvoke error into WASM. """
        if not cls.state.subinvoke.error:
            cls.abort("__w3_subinvoke_error: subinvoke.error is not set")
            return
        
        write_string(cls.state.subinvoke.error, cls.memory.buffer, ptr)

    @classmethod
    async def __w3_subinvoke_implementation(
        cls,
        interface_uri_ptr: int,
        interface_uri_len: int,
        impl_uri_ptr: int,
        impl_uri_len: int,
        module_ptr: int,
        module_len: int,
        method_ptr: int,
        method_len: int,
        input_ptr: int,
        input_len: int
    ) -> bool:
        cls.state.subinvoke_implementation.result = None
        cls.state.subinvoke_implementation.error = None

        impl_uri = read_string(cls.memory.buffer, impl_uri_ptr, impl_uri_len)
        method = read_string(cls.memory.buffer, method_ptr, method_len)
        input = read_bytes(cls.memory.buffer, input_ptr, input_len)

        cls.state.subinvoke_implementation.args = [impl_uri, method, input]

        invoke_results = await cls.client.invoke(
            InvokeApiOptions(
                uri = impl_uri,
                method = method,
                input = input,
                no_decode = True
            )
        )

        if not invoke_results.error:
            if isinstance(invoke_results.data, bytearray):
                msgpack = invoke_results.data
            else:
                msgpack = msgpack_encode(invoke_results.data)
            
            cls.state.subinvoke_implementation.result = msgpack
        else:
            cls.state.subinvoke_implementation.error = f"{invoke_results.error.name}: {invoke_results.error.message}"

        return not invoke_results.error


    @classmethod
    def __w3_subinvoke_implementation_result_len(cls) -> int:
        if not cls.state.subinvoke_implementation.result:
            cls.abort("__w3_subinvokeImplementation_result_len: subinvokeImplementation.result is not set")
            return 0
        
        return cls.state.subinvoke_implementation.result.byteLength

    @classmethod
    def __w3_subinvoke_implementation_result(cls, ptr: int):
        if not cls.state.subinvoke_implementation.result:
            cls.abort("__w3_subinvokeImplementation_result: subinvokeImplementation.result is not set")
            return
        
        return write_bytes(cls.state.subinvoke_implementation.result, cls.memory.buffer, ptr)

    @classmethod
    def __w3_subinvoke_implementation_error_len(cls) -> int:
        if not cls.state.subinvoke_implementation.error:
            cls.abort("__w3_subinvokeImplementation_error_len: subinvokeImplementation.error is not set")
            return 0
        return cls.state.subinvoke_implementation.error.length

    @classmethod
    def __w3_subinvoke_implementation_error(cls, ptr: int):
        if not cls.state.subinvoke_implementation.error:
            cls.abort("__w3_subinvokeImplementation_error: subinvokeImplementation.error is not set")
            return
        
        write_string(cls.state.subinvoke_implementation.error, cls.memory.buffer, ptr)

    @classmethod
    def __w3_invoke_args(cls, method_ptr: int, args_ptr: int):
        """ Copy the invocation's method & args into WASM. """
        if not cls.state.method:
            cls.abort("__w3_invoke_args: method is not set")
            return
        if not cls.state.args:
            cls.abort("__w3_invoke_args: args is not set")
            return
        write_string(cls.state.method, cls.memory.buffer, method_ptr)
        write_bytes(cls.state.args, cls.memory.buffer, args_ptr)

    @classmethod
    def __w3_invoke_result(cls, ptr: int, len: int):
        """ Store the invocation's result. """
        cls.state.invoke.result = read_bytes(cls.memory.buffer, ptr, len)

    @classmethod
    def __w3_invoke_error(cls, ptr: int, len: int):
        """ Store the invocation's error. """
        cls.state.invoke.error = read_string(cls.memory.buffer, ptr, len)

    @classmethod
    def __w3_get_implementations(cls, uri_ptr: int, uri_len: int):
        uri = read_string(cls.memory.buffer, uri_ptr, uri_len)
        result = cls.client.get_implementations(uri, {})
        cls.state.get_implementations_result = msgpack_encode(result)
        return result.length > 0

    @classmethod
    def __w3_get_implementations_result_len(cls) -> int:
        if not cls.state.get_implementation_result:
            cls.abort("__w3_getImplementations_result_len: result is not set")
            return 0
        
        return cls.state.get_implementations_result.byteLength

    @classmethod
    def __w3_get_implementations_result(cls, ptr: int):
        if not cls.state.get_implementations_result:
            cls.abort("__w3_getImplementations_result: result is not set")
            return
        
        write_bytes(cls.state.get_implementations_result, cls.memory.buffer, ptr)

    @classmethod
    def __w3_abort(
        cls,
        msg_ptr: int,
        msg_len: int,
        file_ptr: int,
        file_len: int,
        line: int,
        column: int
    ):
        msg = read_string(cls.memory.buffer, msg_ptr, msg_len)
        file = read_string(cls.memory.buffer, file_ptr, file_len)

        cls.abort(f"__w3_abort: {msg}\nFile: {file}\nLocation: [{line},{column}]")

    @classmethod
    def __w3_debug_log(cls, ptr: int, len: int):
        msg = read_string(cls.memory.buffer, ptr, len)
        logger.debug(f"__w3_debug_log: {msg}")

    @classmethod
    def __w3_load_env(cls, ptr: int):
        if cls.state.env:
            write_bytes(cls.state.env, cls.memory.buffer, ptr)

    @classmethod
    def __w3_sanitize_env_args(cls, ptr: int):
        if not cls.state.sanitize_env.args:
            cls.abort("__w3_sanitize_env: args is not set")
            return
        
        write_bytes(cls.state.sanitize_env.args, cls.memory.buffer, ptr)

    @classmethod
    def __w3_sanitize_env_result(cls, ptr: int, len: int):
        cls.state.sanitize_env.result = read_bytes(cls.memory.buffer, ptr, len)

@dataclass
class ImportConfig():
    client: Client
    memory: wasmer.Memory
    state: State
    abort: Callable


def create_imports(
    config: ImportConfig
) -> W3Imports:
    return W3Imports(
        w3 = W3ImportW3Implementation(config),
        env = config["memory"]
    )
