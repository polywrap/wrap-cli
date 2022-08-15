from __future__ import annotations
from enum import Enum
from typing import Any, List, Union

import msgpack


class CoreInterfaceUrisGeneric(Enum):
    # must be in range 0-127
    GENERIC_MAP = 1


def extension_encode(obj: Any) -> bytes:
    if isinstance(obj, dict):
        optimized = {}
        for key, value in obj:
            optimized[key] = value
        return msgpack.packb(optimized)
    else:
        return None


def extension_decode(obj: bytes) -> Any:
    map = msgpack.unpackb(obj)
    return dict(map.items())


def msgpack_encode(object: Any) -> bytes:
    return msgpack.packb(object, default=extension_encode, use_bin_type=True)


def msgpack_decode(buffer: Union[List, bytes]) -> Any:
    return msgpack.unpackb(buffer, object_hook=extension_decode, raw=False)
