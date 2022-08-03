from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TypedDict

class W3Exports(ABC, WebAssembly.Exports):
    @classmethod
    @abstractmethod
    def _w3_invoke(cls, name_len: int, args_len: int) -> bool:
        return

    @classmethod
    @abstractmethod
    def _w3_load_env(cls, env_len: int):
        return

    @classmethod
    @abstractmethod
    def _w3_sanitize_env(cls, args_len: int):
        return


class W3ImportsW3(ABC):
    @classmethod
    @abstractmethod
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
        return

    @classmethod
    @abstractmethod
    def __w3_subinvoke_result_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __w3_subinvoke_result(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __w3_subinvoke_error_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __w3_subinvoke_error(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
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
        return
    
    @classmethod
    @abstractmethod
    def __w3_subinvoke_implementation_result_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __w3_subinvoke_implementation_result(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __w3_subinvoke_implementation_error_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __w3_subinvoke_implementation_error(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __w3_invoke_args(cls, method_ptr: int, args_ptr: int):
        return

    @classmethod
    @abstractmethod
    def __w3_invoke_result(cls, ptr: int, len: int):
        return

    @classmethod
    @abstractmethod
    def __w3_invoke_error(cls, ptr: int, len: int):
        return

    @classmethod
    @abstractmethod
    def __w3_get_implementations(cls, uri_ptr: int, uri_len: int):
        return

    @classmethod
    @abstractmethod
    def __w3_get_implementations_result_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __w3_get_implementations_result(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __w3_abort(
        cls,
        msg_ptr: int,
        msg_len: int,
        file_ptr: int,
        file_len: int,
        line: int,
        column: int
    ):
        return

    @classmethod
    @abstractmethod
    def __w3_debug_log(cls, ptr: int, len: int):
        return

    @classmethod
    @abstractmethod
    def __w3_load_env(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __w3_sanitize_env_args(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __w3_sanitize_env_result(cls, ptr: int, len: int):
        return


class W3ImportsEnv(TypedDict):
    memory: WebAssembly.Memory


@dataclass
class W3Imports(ABC, WebAssembly.Imports):
    w3: W3ImportsW3
    env: W3ImportsEnv
