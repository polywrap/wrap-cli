from dataclasses import dataclass, field
from typing import Optional, Dict, Any, Union, List


@dataclass(slots=True, kw_only=True)
class InvokeOptions:
    """
    Options required for a wrapper invocation.

    Args:
        uri: Uri of the wrapper
        method: Method to be executed
        args: Arguments for the method, structured as a dictionary
        config: Override the client's config for all invokes within this invoke.
        context_id: Invoke id used to track query context data set internally.
    """
    # uri: str
    method: str
    args: Optional[Union[Dict[str, Any], bytes]] = field(default_factory=dict)
    env: Optional[Dict[str, Any]] = None
    resolution_context: Optional[Any] = None


@dataclass(kw_only=True)
class State:
    invoke: Dict[str, Union[bytearray, str]]
    # subinvoke: Dict[str, Union[bytearray, str, List[Any]]]
    # subinvoke_implementation: Dict[str, Union[bytearray, str, List[Any]]]
    method: str
    args: bytearray = None
    env: bytearray = None
