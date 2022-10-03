import ctypes


def read_string(source: str, source_length: int, offset: int, length: int):
    source = (ctypes.c_ubyte * source_length)(source)
    return source[offset: offset + length]


def write_string(
        value: str,
        dst: ctypes._Pointer,
        value_offset: int,
) -> bytearray:
    value_buffer = value.encode("ascii")
    return mem_cpy(
        bytearray(value_buffer),
        dst,
        len(value_buffer),
        value_offset
    )


def write_bytes(
        value: bytearray,
        dst: ctypes._Pointer,
        value_offset: int,
) -> bytearray:
    return mem_cpy(value, dst, len(value), value_offset)


def mem_cpy(
        dst: ctypes._Pointer,
        src: bytearray,
        length: int,
        offset: int
) -> bytearray:
    try:
        print(src)
        # src = (ctypes.c_ubyte * offset)(*src)
        # ctypes.memmove(dst, src, length)
    except MemoryError as e:
        print("Memory error!")
        print(e)

    return dst
