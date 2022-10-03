from dataclasses import dataclass
from typing import Dict, Union

@dataclass(kw_only=True)
class State:
    invoke: Dict[str, Union[bytearray, str]]
    # subinvoke: Dict[str, Union[bytearray, str, List[Any]]]
    # subinvoke_implementation: Dict[str, Union[bytearray, str, List[Any]]]
    method: str
    args: bytearray = None
    env: bytearray = None
