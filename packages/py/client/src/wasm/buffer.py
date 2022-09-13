from typing import List


def write_string(
    str: str,
    dst: bytearray,
    dst_offset: int
) -> List[int]:
    str_buffer = str.encode("ascii")
    view = list(dst)
    return mem_cpy(
        str_buffer,
        0,
        view,
        dst_offset,
        len(str_buffer)
    )


def write_bytes(
    bytes: bytearray,
    dst: bytearray,
    dst_offset: int
) -> List[int]:
    bytes_view = list(bytes)
    dst_view = list(dst)
    return mem_cpy(bytes_view, 0, dst_view, dst_offset, len(bytes_view))


def read_bytes(
    from_src: bytearray,
    offset: int,
    length: int
) -> bytearray:
    buffer = bytearray()
    write_bytes(from_src[offset, offset + length], buffer, 0)
    return buffer


def read_string(
    from_src: bytearray,
    offset: int,
    length: int
):
    buffer = read_bytes(from_src, offset, length)
    return buffer.decode()


def mem_cpy(
    src: List[int],
    src_offset: int,
    dst: List[int],
    dst_offset: int,
    length: int
) -> List[int]:
    dst[0 + dst_offset: length] = src[0 + src_offset: length]
    return dst
