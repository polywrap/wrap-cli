import msgpack


def msgpack_encode(object):
    return msgpack.packb(object)


def msgpack_decode(object):
    return msgpack.unpackb(object)
