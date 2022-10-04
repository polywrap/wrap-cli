import ctypes
from typing import Callable

from wasmtime import Store, Linker, Memory, Module, MemoryType, Limits, ValType, FuncType

from .buffer import write_string, write_bytes
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

    def wrap_abort(msg_ptr: int, msg_len: int, file_ptr: int, file_len: int, line: int, column: int):
        pass
        # msg = read_string(mem.data_ptr(store), msg_ptr, msg_len)
        # file = read_string(mem.data_ptr(store), file_ptr, file_len)
        # abort(f"__wrap_abort: {msg}\nFile: {file}\nLocation: [{line},{column}]")

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
        state.invoke['result'] = bytearray()[offset: offset + length]

    wrap_invoke_error_type = FuncType(
        [ValType.i32(), ValType.i32()], []
    )

    def wrap_invoke_error(ptr: int, length: int):
        buffer = bytearray(mem.data_ptr(store))[ptr: ptr + length]
        # print(mem.data_len(store))
        # print(len(bytearray(mem.data_ptr(store))))
        # print(list(bytearray(mem.data_ptr(store))))
        # print(bytearray(mem.data_ptr(store)).decode())
        print("wrap invoke error")
        print(ptr)
        print(length)
        # bytearray(mem.data_len(store))
        # bytearray(mem.data_ptr(store)[ptr])
        state.invoke['error'] = buffer.decode()

    linker.define_func("wrap", "__wrap_abort", wrap_abort_type, wrap_abort)
    linker.define_func("wrap", "__wrap_invoke_args", wrap_invoke_args_type, wrap_invoke_args)
    linker.define_func("wrap", "__wrap_invoke_result", wrap_invoke_result_type, wrap_invoke_result)
    linker.define_func("wrap", "__wrap_invoke_error", wrap_invoke_error_type, wrap_invoke_error)
    linker.define("env", "memory", mem)
    return linker.instantiate(store, module)
