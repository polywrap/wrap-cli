from typing import Any, Dict, List
import msgpack
from msgpack.exceptions import UnpackValueError
from enum import Enum


class ExtensionTypes(Enum):
    GENERIC_MAP = 1


def sanitize(value: Any) -> Any:
    if type(value) is dict:
        dictionary: Dict[Any, Any] = value
        for key, val in dictionary.items():
            if type(key) == str:
                dictionary[key] = sanitize(val)
            else:
                raise ValueError(f"expected dict key to be str received {key} with type {type(key)}")
        return dictionary
    elif type(value) is list:
        array: List[Any] = value
        return [sanitize(a) for a in array]
    elif type(value) is tuple:
        array: List[Any] = list(value)
        return sanitize(array)
        ##previous implementation below:
        #array: List[Any] = list(*value)
        #return [sanitize(a) for a in array]
    elif type(value) is set:
        sanitized_set: List[Any] = [i for i in value]
        return sanitized_set
    elif type(value) == complex:
        print(value)
        print(str(value)) 
        return str(value)
    elif hasattr(value, "__slots__"):
        return {s: sanitize(getattr(value, s)) for s in getattr(value, "__slots__") if hasattr(value, s)}
    elif hasattr(value, "__dict__"):
        return {k: sanitize(v) for k, v in vars(value).items()}
    else:
        return value


def msgpack_encode(obj: object) -> bytes:
    sanitized = sanitize(obj)
    return msgpack.packb(sanitized)


def msgpack_decode(val: bytes):
    def ext_hook(code: int, data: bytes) -> bytes:
        if code == ExtensionTypes.GENERIC_MAP.value:
            return msgpack_decode(data)
        raise UnpackValueError("Invalid Extention type")

    return msgpack.unpackb(val, ext_hook=ext_hook)
