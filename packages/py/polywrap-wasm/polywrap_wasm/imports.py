from unsync import unsync, Unfuture
from wasmtime import (
    Store,
    Linker,
    Memory,
    Module,
    MemoryType,
    Limits,
    ValType,
    FuncType,
    Instance,
)

from polywrap_core import Invoker, InvokerOptions, Uri, InvokeResult

from .buffer import write_string, write_bytes, read_string, read_bytes
from .types.state import State
from .errors import WasmAbortError


@unsync
async def unsync_invoke(invoker: Invoker, options: InvokerOptions) -> InvokeResult:
    return await invoker.invoke(options)


def create_instance(
    store: Store,
    module: Module,
    state: State,
    invoker: Invoker,
) -> Instance:
    linker = Linker(store.engine)

    """
    TODO: Re-check this based on issue https://github.com/polywrap/toolchain/issues/561
    This probably means that memory creation should be moved to its own function 
    """
    mem = Memory(store, MemoryType(Limits(1, None)))

    wrap_abort_type = FuncType(
        [
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
        ],
        [],
    )

    def wrap_abort(
        msg_offset: int,
        msg_len: int,
        file_offset: int,
        file_len: int,
        line: int,
        column: int,
    ) -> None:
        msg = read_string(mem.data_ptr(store), mem.data_len(store), msg_offset, msg_len)
        file = read_string(
            mem.data_ptr(store), mem.data_len(store), file_offset, file_len
        )
        raise WasmAbortError(
            f"__wrap_abort: {msg}\nFile: {file}\nLocation: [{line},{column}]"
        )

    wrap_invoke_args_type = FuncType([ValType.i32(), ValType.i32()], [])

    def wrap_invoke_args(method_ptr: int, args_ptr: int) -> None:
        if not state.method:
            raise WasmAbortError("__wrap_invoke_args: method is not set")
        else:
            write_string(
                mem.data_ptr(store), mem.data_len(store), state.method, method_ptr
            )

        if not state.args:
            raise WasmAbortError("__wrap_invoke_args: args is not set")
        else:
            write_bytes(
                mem.data_ptr(store),
                mem.data_len(store),
                bytearray(state.args),
                args_ptr,
            )

    wrap_invoke_result_type = FuncType([ValType.i32(), ValType.i32()], [])

    def wrap_invoke_result(offset: int, length: int) -> None:
        result = read_bytes(mem.data_ptr(store), mem.data_len(store), offset, length)
        state.invoke["result"] = result

    wrap_invoke_error_type = FuncType([ValType.i32(), ValType.i32()], [])

    def wrap_invoke_error(offset: int, length: int):
        error = read_string(mem.data_ptr(store), mem.data_len(store), offset, length)
        state.invoke["error"] = error

    wrap_subinvoke_type = FuncType(
        [
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
            ValType.i32(),
        ],
        [ValType.i32()],
    )

    def wrap_subinvoke(
        uri_ptr: int,
        uri_len: int,
        method_ptr: int,
        method_len: int,
        args_ptr: int,
        args_len: int,
    ) -> bool:
        uri = read_string(mem.data_ptr(store), mem.data_len(store), uri_ptr, uri_len)
        method = read_string(
            mem.data_ptr(store), mem.data_len(store), method_ptr, method_len
        )
        args = read_bytes(mem.data_ptr(store), mem.data_len(store), args_ptr, args_len)

        unfuture_result: Unfuture[InvokeResult] = unsync_invoke(
            invoker,
            InvokerOptions(uri=Uri(uri), method=method, args=args, encode_result=True),
        )
        result = unfuture_result.result()

        if result.result:
            state.subinvoke["result"] = result.result
            return True
        elif result.error:
            state.subinvoke["error"] = "".join(str(x) for x in result.error.args)
            return False
        else:
            raise ValueError("subinvocation failed!")

    wrap_subinvoke_result_len_type = FuncType([], [ValType.i32()])

    def wrap_subinvoke_result_len() -> int:
        if not state.subinvoke["result"]:
            raise WasmAbortError(
                "__wrap_subinvoke_result_len: subinvoke.result is not set"
            )
        return len(state.subinvoke["result"])

    wrap_subinvoke_result_type = FuncType([ValType.i32()], [])

    def wrap_subinvoke_result(ptr: int) -> None:
        if not state.subinvoke["result"]:
            raise WasmAbortError("__wrap_subinvoke_result: subinvoke.result is not set")
        write_bytes(
            mem.data_ptr(store), mem.data_len(store), state.subinvoke["result"], ptr
        )

    wrap_subinvoke_error_len_type = FuncType([], [ValType.i32()])

    def wrap_subinvoke_error_len() -> int:
        if not state.subinvoke["error"]:
            raise WasmAbortError(
                "__wrap_subinvoke_error_len: subinvoke.error is not set"
            )
        return len(state.subinvoke["error"])

    wrap_subinvoke_error_type = FuncType([ValType.i32()], [])

    def wrap_subinvoke_error(ptr: int) -> None:
        if not state.subinvoke["error"]:
            raise WasmAbortError("__wrap_subinvoke_error: subinvoke.error is not set")
        write_string(
            mem.data_ptr(store), mem.data_len(store), state.subinvoke["error"], ptr
        )

    # TODO: use generics or any on wasmtime codebase to fix typings
    linker.define_func("wrap", "__wrap_abort", wrap_abort_type, wrap_abort)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_invoke_args", wrap_invoke_args_type, wrap_invoke_args)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_invoke_result", wrap_invoke_result_type, wrap_invoke_result)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_invoke_error", wrap_invoke_error_type, wrap_invoke_error)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_subinvoke", wrap_subinvoke_type, wrap_subinvoke)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_subinvoke_result_len", wrap_subinvoke_result_len_type, wrap_subinvoke_result_len)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_subinvoke_result", wrap_subinvoke_result_type, wrap_subinvoke_result)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_subinvoke_error_len", wrap_subinvoke_error_len_type, wrap_subinvoke_error_len)  # type: ignore partially unknown
    linker.define_func("wrap", "__wrap_subinvoke_error", wrap_subinvoke_error_type, wrap_subinvoke_error)  # type: ignore partially unknown
    linker.define("env", "memory", mem)
    return linker.instantiate(store, module)
