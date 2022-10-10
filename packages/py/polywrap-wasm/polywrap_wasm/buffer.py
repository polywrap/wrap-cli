import ctypes
from typing import Optional


BufferPointer = ctypes._Pointer[ctypes.c_ubyte] # type: ignore


def read_bytes(memory_pointer: BufferPointer, memory_length: int, offset: Optional[int] = None, length: Optional[int] = None) -> bytearray:
    result = bytearray(memory_length)
    buffer = (ctypes.c_ubyte * memory_length).from_buffer(result)
    ctypes.memmove(buffer, memory_pointer, memory_length)

    return result[offset: offset + length] if offset and length else result


def read_string(memory_pointer: BufferPointer, memory_length: int, offset: int, length: int) -> str:
    value = read_bytes(memory_pointer, memory_length, offset, length)
    return value.decode("utf-8")


def write_string(
        memory_pointer: BufferPointer,
        memory_length: int,
        value: str,
        value_offset: int,
) -> None:
    value_buffer = value.encode("utf-8")
    mem_cpy(
        memory_pointer,
        memory_length,
        bytearray(value_buffer),
        len(value_buffer),
        value_offset
    )


def write_bytes(
        memory_pointer: BufferPointer,
        memory_length: int,
        value: bytearray,
        value_offset: int,
) -> None:
    mem_cpy(memory_pointer, memory_length, bytearray(value), len(value), value_offset)


def mem_cpy(
        memory_pointer: BufferPointer,
        memory_length: int,
        value: bytearray,
        value_length: int,
        value_offset: int
) -> None:
    try:
        current_value = read_bytes(
            memory_pointer,
            memory_length,
        )

        new_value = (ctypes.c_ubyte * value_length).from_buffer(value)
        current_value[value_offset: value_offset + value_length] = new_value

        current_value_buffer = (ctypes.c_ubyte * memory_length).from_buffer(current_value)
        ctypes.memmove(memory_pointer, current_value_buffer, memory_length)
    except MemoryError as e:
        print("Memory error!")
        print(e)
