from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass

import wasmer


@dataclass
class WrapImportsEnv():
    memory: wasmer.Memory


class WrapImportsEnv(ABC):
    @classmethod
    @abstractmethod
    def _wrap_invoke(cls, name_len: int, args_len: int) -> bool:
        return

    @classmethod
    @abstractmethod
    def _wrap_load_env(cls, env_len: int):
        return

    @classmethod
    @abstractmethod
    def _wrap_sanitize_env(cls, args_len: int):
        return


class WrapImports(ABC):
    @classmethod
    @abstractmethod
    async def __wrap_subinvoke(
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
    def __wrap_subinvoke_result_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __wrap_subinvoke_result(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_subinvoke_error_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __wrap_subinvoke_error(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    async def __wrap_subinvoke_implementation(
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
    def __wrap_subinvoke_implementation_result_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __wrap_subinvoke_implementation_result(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_subinvoke_implementation_error_len(cls) -> int:
        return

    @classmethod
    @abstractmethod
    def __wrap_subinvoke_implementation_error(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_invoke_args(cls, method_ptr: int, args_ptr: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_invoke_result(cls, ptr: int, len: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_invoke_error(cls, ptr: int, len: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_abort(
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
    def __wrap_debug_log(cls, ptr: int, len: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_load_env(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_sanitize_env_args(cls, ptr: int):
        return

    @classmethod
    @abstractmethod
    def __wrap_sanitize_env_result(cls, ptr: int, len: int):
        return


@dataclass
class WrapImports(ABC):
    wrap: WrapImports
    env: WrapImportsEnv
