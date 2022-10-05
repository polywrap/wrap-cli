import ctypes

from polywrap_msgpack import msgpack_decode


Pointer = ctypes._PointerLike # type: ignore


def read_bytes(memory_pointer: Pointer, memory_length: int, offset: int = None, length: int = None):
    result = bytearray(memory_length)
    buffer = (ctypes.c_char * memory_length).from_buffer(result)
    ctypes.memmove(buffer, memory_pointer, memory_length)

    return result[offset: offset + length] if offset and length else result


def read_string(memory_pointer: ctypes._Pointer, memory_length: int, offset: int, length: int):
    value = read_bytes(memory_pointer, memory_length, offset, length)
    return msgpack_decode(value)


def write_string(
        memory_pointer: ctypes._Pointer,
        memory_length: int,
        value: str,
        value_offset: int,
) -> bytearray:
    value_buffer = value.encode()
    return mem_cpy(
        memory_pointer,
        memory_length,
        bytearray(value_buffer),
        len(value_buffer),
        value_offset
    )


def write_bytes(
        memory_pointer: ctypes._Pointer,
        memory_length: int,
        value: bytearray,
        value_offset: int,
) -> bytearray:
    return mem_cpy(memory_pointer, memory_length, bytearray(value), len(value), value_offset)


def mem_cpy(
        memory_pointer: ctypes._Pointer,
        memory_length: int,
        value: bytearray,
        value_length: int,
        value_offset: int
) -> bytearray:
    try:
        current_value = read_bytes(
            memory_pointer,
            memory_length,
        )

        new_value = (ctypes.c_char * value_length).from_buffer(value)
        current_value[value_offset: value_offset + value_length] = new_value

        current_value_buffer = (ctypes.c_char * memory_length).from_buffer(current_value)
        ctypes.memmove(memory_pointer, current_value_buffer, memory_length)
    except MemoryError as e:
        print("Memory error!")
        print(e)

    return bytearray()
