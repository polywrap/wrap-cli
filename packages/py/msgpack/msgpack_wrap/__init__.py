import msgpack
from dataclasses import dataclass, is_dataclass


def sanitize(v):
    for key in v.keys():
        if is_dataclass(v[key]):
            v[key] = v[key].__dict__
            continue

        if type(v[key]) is dict:
            v[key] = sanitize(v[key])
            continue

    return v


def msgpack_encode(v: dict or dataclass):
    if is_dataclass(v):
        v = v.__dict__

    v = sanitize(v)
    return msgpack.packb(v)


def msgpack_decode(v: bytes):
    return msgpack.unpackb(v)
