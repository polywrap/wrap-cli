from dataclasses import dataclass, field
from typing import Optional, TypedDict


class RawInvokeResult(TypedDict):
    result: Optional[bytes]
    error: Optional[str]

@dataclass(kw_only=True, slots=True)
class State:
    invoke: RawInvokeResult = field(default_factory= lambda: {"result": None, "error": None})
    # subinvoke: Dict[str, Union[bytearray, str, List[Any]]]
    # subinvoke_implementation: Dict[str, Union[bytearray, str, List[Any]]]
    method: Optional[str] = None
    args: Optional[bytes] = None
    env: Optional[bytes] = None
