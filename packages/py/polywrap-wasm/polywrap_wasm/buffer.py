import ctypes


def read_string(source: ctypes._Pointer, pointer: int, length: int):
    result = bytearray(65536)
    buffer = (ctypes.c_char * 65536).from_buffer(result)
    ctypes.memmove(buffer, source, 65536)

    return result[pointer: pointer + length]


def read_bytes(memory_pointer: ctypes._Pointer, memory_length: int, offset: int, length: int):
    result = bytearray(memory_length)
    buffer = (ctypes.c_char * memory_length).from_buffer(result)
    ctypes.memmove(buffer, memory_pointer, memory_length)

    return result[offset: offset + length]


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
        current_value = bytearray(memory_length)
        print("just initialized")
        print(current_value[value_offset: value_offset + value_length])
        # print(current_value)
        current_value_buffer = (ctypes.c_char * memory_length).from_buffer(current_value)
        ctypes.memmove(current_value_buffer, memory_pointer, memory_length)

        print("memory should be updated")
        print(current_value[value_offset: value_offset + value_length])

        new_value = (ctypes.c_char * value_length).from_buffer(value)
        current_value[value_offset: value_offset + value_length] = new_value

        print("memory should be updated with current value!")
        print(current_value[value_offset: value_offset + value_length])

        current_value_buffer = (ctypes.c_char * memory_length).from_buffer(current_value)
        ctypes.memmove(memory_pointer, current_value_buffer, memory_length)

        # print(new_value)
        # print(dst)
        # ctypes.memmove(dst, src, length)
    except MemoryError as e:
        print("Memory error!")
        print(e)

    return bytearray()
