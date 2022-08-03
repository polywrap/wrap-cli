from __future__ import annotations
from dataclasses import dataclass, field
from typing import Union, Dict, Any, Awaitable
from abc import ABC, abstractmethod


@dataclass
class InvokeApiOptions:
    """Options required for an API invocation."""

    uri: Union[Uri, str]
    """The API's URI"""
    method: str
    """Method to be executed"""
    input: Union[Dict[str, Any], bytearray] = field(default_factory=dict)
    """Input arguments for the method, structured as a map, removing the chance of incorrectly ordering arguments"""
    result_filter: Dict[str, Any] = field(default_factory=dict)
    """Filters the [[InvokeApiResult]] data properties. The key of this map is the property's name, while the value is either true (meaning select this prop), or a nested named map, allowing for the filtering of nested objects"""
    no_decode: bool = False
    """If set to true, the invoke function will not decode the msgpack results into Python objects, and instead return the raw ArrayBuffer"""
    config: ClientConfig = None
    """Override the client's config for all invokes within this invoke"""
    context_id: str = ''
    """Invoke id used to track query context data set internally"""


@dataclass
class InvokeApiResult:
    """Result of an API invocation."""

    data: Any
    """Invoke result data. The type of this value is the return type of the method. If undefined, it means something went wrong. Errors should be populated with information as to what happened. Null is used to represent an intentionally null result."""
    error: Exception = None
    """Errors encountered during the invocation."""


class InvokeHandler(ABC):
    @classmethod
    @abstractmethod
    def invoke(cls, options: InvokeApiOptions) -> Awaitable[InvokeApiResult]:
        return
