from dataclasses import dataclass
from typing import Dict, Union, List, Any

from polywrap_core import InvokeOptions, Wrapper, Uri


@dataclass
class State():
    method: str
    args: bytearray
    invoke: Dict[str, Union[bytearray, str]]
    subinvoke: Dict[str, Union[bytearray, str, List[Any]]]
    subinvoke_implementation: Dict[str, Union[bytearray, str, List[Any]]]
    invoke_res: Dict[str, Union[bytearray, str]]
    sanitize_env: Dict[str, bytearray]
    env: bytearray = None


class WasmWrapper(Wrapper):
    required_exports = ["_wrap_invoke"]

    def invoke(self):
        return True
