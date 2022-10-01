def write_string(
    string: str,
    dst: bytearray,
    dst_offset: int
) -> bytearray:
    str_buffer = string.encode("ascii")
    return mem_cpy(
        bytearray(str_buffer),
        0,
        dst,
        dst_offset,
        len(str_buffer)
    )


def write_bytes(
    bytes: bytearray,
    dst: bytearray,
    dst_offset: int
) -> bytearray:
    return mem_cpy(bytes, 0, dst, dst_offset, len(bytes))


def read_bytes(
    from_src: bytearray,
    offset: int,
    length: int
) -> bytearray:
    buffer = bytearray(length)
    write_bytes(from_src[offset: offset + length], buffer, 0)
    return buffer


def read_string(
    from_src: bytearray,
    offset: int,
    length: int
):
    buffer = read_bytes(from_src, offset, length)
    return buffer.decode()


def mem_cpy(
    src: bytearray,
    src_offset: int,
    dst: bytearray,
    dst_offset: int,
    length: int
) -> bytearray:
    dst[dst_offset: length] = src[src_offset: length]
    return dst
