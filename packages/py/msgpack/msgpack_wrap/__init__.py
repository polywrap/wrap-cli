import msgpack
from enum import Enum
from dataclasses import dataclass, is_dataclass, asdict


class ExtensionTypes(Enum):
    GENERIC_MAP = 1


def sanitize(v):
    for key in v.keys():
        if is_dataclass(v[key]):
            v[key] = asdict(v[key])
            continue

        if type(v[key]) is dict:
            v[key] = sanitize(v[key])
            continue

    return v


def generic_map_encoder(obj):
    return msgpack.ExtType(ExtensionTypes.GENERIC_MAP.value, obj)


def generic_map_decoder(code, data):
    if code == ExtensionTypes.GENERIC_MAP.value:
        return data


def msgpack_encode(v: object or dataclass):
    if is_dataclass(v):
        v = asdict(v)

    if type(v) is dict:
        v = sanitize(v)
        return msgpack.packb(v, default=generic_map_encoder)

    return msgpack.packb(v)


def msgpack_decode(v: bytes):
    return msgpack.unpackb(v, ext_hook=generic_map_decoder)
