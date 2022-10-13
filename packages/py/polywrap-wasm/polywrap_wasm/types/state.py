from dataclasses import dataclass, field
from typing import Any, List, Optional, TypedDict


class RawInvokeResult(TypedDict):
    result: Optional[bytes]
    error: Optional[str]


class RawSubinvokeResult(TypedDict):
    result: Optional[bytes]
    error: Optional[str]
    args: List[Any]


class RawSubinvokeImplementationResult(TypedDict):
    result: Optional[bytes]
    error: Optional[str]
    args: List[Any]


@dataclass(kw_only=True, slots=True)
class State:
    invoke: RawInvokeResult = field(
        default_factory=lambda: {"result": None, "error": None}
    )
    subinvoke: RawSubinvokeResult = field(
        default_factory=lambda: {"result": None, "error": None, "args": []}
    )
    subinvoke_implementation: RawSubinvokeImplementationResult = field(
        default_factory=lambda: {"result": None, "error": None, "args": []}
    )
    method: Optional[str] = None
    args: Optional[bytes] = None
    env: Optional[bytes] = None
