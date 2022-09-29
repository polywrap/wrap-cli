from dataclasses import dataclass
from typing import Dict, Union, List, Any
from wasmtime import Store, Module, Instance, ImportType, Global

from .core_mock import InvokeOptions

@dataclass
class State:
    method: str
    args: bytearray
    invoke: Dict[str, Union[bytearray, str]]
    subinvoke: Dict[str, Union[bytearray, str, List[Any]]]
    subinvoke_implementation: Dict[str, Union[bytearray, str, List[Any]]]
    invoke_res: Union[bytearray, str]
    env: bytearray = None


class WasmWrapper:
    required_export = "_wrap_invoke"
    wasm_module = None
    store = None
    Global

    def get_wasm_module(self):
        self.wasm_module = "./polywrap_wasm/module.wasm"

    def create_wasm_instance(self):
        self.store = Store()
        module = Module.from_file(self.store.engine, self.wasm_module)
        instance = Instance(self.store, module, [

        ])
        return instance

    def invoke(self, options: InvokeOptions = None):
        self.get_wasm_module()
        instance = self.create_wasm_instance()
        exports = instance.exports(self.store)
        return exports["gcd"](self.store, 6, 27)
