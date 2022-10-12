from wasmtime import Func, Instance, Store

from .errors import ExportNotFoundError


class WrapExports():
    _instance: Instance
    _store: Store
    _wrap_invoke: Func

    def __init__(self, instance: Instance, store: Store):
        self._instance = instance
        self._store = store
        exports = instance.exports(store)
        _wrap_invoke = exports.get("_wrap_invoke")
        if not _wrap_invoke or not isinstance(_wrap_invoke, Func):
            raise ExportNotFoundError("Unable to find exported wasm module function: _wrap_invoke in the module")
        self._wrap_invoke = _wrap_invoke
    
    def __wrap_invoke__(self, method_length: int, args_length: int, env_length: int) -> bool:
        return bool(self._wrap_invoke(self._store, method_length, args_length, env_length))
