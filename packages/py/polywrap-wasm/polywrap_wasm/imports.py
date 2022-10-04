import ctypes
from typing import Callable

from wasmtime import Store, Linker, Memory, Module, MemoryType, Limits, ValType, FuncType

from .buffer import write_string, write_bytes, read_string
from .types.state import State


def create_imports(
        store: Store,
        module: Module,
        state: State,
        abort: Callable[[str], None]
):
    linker = Linker(store.engine)

    """
    TODO: Re-check this based on issue https://github.com/polywrap/toolchain/issues/561
    This probably means that memory creation should be moved to its own function 
    """
    mem = Memory(store, MemoryType(Limits(1, None)))

    wrap_abort_type = FuncType(
        [ValType.i32(), ValType.i32(), ValType.i32(), ValType.i32(), ValType.i32(), ValType.i32()], []
    )

    def wrap_abort(msg_offset: int, msg_len: int, file_offset: int, file_len: int, line: int, column: int):
        msg = read_string(mem.data_ptr(store), mem.data_len(store), msg_offset, msg_len)
        file = read_string(mem.data_ptr(store), mem.data_len(store), file_offset, file_len)
        abort(f"__wrap_abort: {msg}\nFile: {file}\nLocation: [{line},{column}]")

    wrap_invoke_args_type = FuncType(
        [ValType.i32(), ValType.i32()], []
    )

    def wrap_invoke_args(method_ptr: int, args_ptr: int):
        if state.method == "":
            abort("__wrap_invoke_args: method is not set")

        if state.args == "":
            abort("__wrap_invoke_args: args is not set")

        write_string(mem.data_ptr(store), mem.data_len(store), state.method, method_ptr)
        write_bytes(mem.data_ptr(store), mem.data_len(store), state.args, args_ptr)

    wrap_invoke_result_type = FuncType(
        [ValType.i32(), ValType.i32()], []
    )

    def wrap_invoke_result(offset: int, length: int):
        result = read_string(mem.data_ptr(store), mem.data_len(store), offset, length)
        state.invoke['result'] = result

    wrap_invoke_error_type = FuncType(
        [ValType.i32(), ValType.i32()], []
    )

    def wrap_invoke_error(offset: int, length: int):
        error = read_string(mem.data_ptr(store), mem.data_len(store), offset, length)
        state.invoke['error'] = error

    linker.define_func("wrap", "__wrap_abort", wrap_abort_type, wrap_abort)
    linker.define_func("wrap", "__wrap_invoke_args", wrap_invoke_args_type, wrap_invoke_args)
    linker.define_func("wrap", "__wrap_invoke_result", wrap_invoke_result_type, wrap_invoke_result)
    linker.define_func("wrap", "__wrap_invoke_error", wrap_invoke_error_type, wrap_invoke_error)
    linker.define("env", "memory", mem)
    return linker.instantiate(store, module)
