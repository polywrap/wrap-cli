from dataclasses import dataclass, field
from typing import Dict, Optional, Union

@dataclass(kw_only=True, slots=True)
class State:
    invoke: Dict[str, Union[bytes, str]] = field(default_factory=dict)
    # subinvoke: Dict[str, Union[bytearray, str, List[Any]]]
    # subinvoke_implementation: Dict[str, Union[bytearray, str, List[Any]]]
    method: Optional[str] = None
    args: Optional[bytes] = None
    env: Optional[bytes] = None
