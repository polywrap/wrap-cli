from dataclasses import dataclass

from msgpack_wrap import msgpack_encode, msgpack_decode


def test_encode_and_decode_object():
    expected_array_like = [
        130, 168, 102, 105, 114, 115, 116, 75,
        101, 121, 170, 102, 105, 114, 115, 116,
        86, 97, 108, 117, 101, 169, 115, 101,
        99, 111, 110, 100, 75, 101, 121, 171,
        115, 101, 99, 111, 110, 100, 86, 97,
        108, 117, 101
    ]

    custom_object = {
        "firstKey": "firstValue",
        "secondKey": "secondValue"
    }

    encoded = msgpack_encode(custom_object)
    assert encoded == bytes(expected_array_like)

    decoded = msgpack_decode(encoded)
    assert decoded == custom_object

# TODO: Make sure that dataclasses are also supported, thinking
# in a pythonic way

@dataclass
class Test:
    first_key: str
    second_key: str


test = Test("yes", "no")

def test_encode_and_decode_map():
    # custom_map = {
    #     "firstKey": {
    #         "one": "1"
    #     },
    #     "secondKey": {
    #         "two": "2"
    #     }
    # }
    #
    # encoded = msgpack_encode(custom_map)
    # decoded = msgpack_decode(encoded)
    # assert decoded == custom_map
    #
    # custom_map["firstKey"] = bytes([1, 2, 3])
    # custom_map["secondKey"] = bytes([3, 2, 1])
    #
    # encoded = msgpack_encode(custom_map)
    # decoded = msgpack_decode(encoded)
    # assert decoded == custom_map

    encoded = msgpack_encode(test)
    assert encoded == bytes(test)

