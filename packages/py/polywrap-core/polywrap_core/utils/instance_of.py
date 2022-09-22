import inspect
from typing import Any


def instance_of(obj: Any, cls: Any):
    return cls in inspect.getmro(obj.__class__)
