from dataclasses import dataclass

from polywrap_msgpack import msgpack_encode, msgpack_decode

expected_array_like = [
    130, 168, 102, 105, 114, 115, 116, 75,
    101, 121, 170, 102, 105, 114, 115, 116,
    86, 97, 108, 117, 101, 169, 115, 101,
    99, 111, 110, 100, 75, 101, 121, 171,
    115, 101, 99, 111, 110, 100, 86, 97,
    108, 117, 101
]


def test_encode_and_decode_object():
    custom_object = {
        "firstKey": "firstValue",
        "secondKey": "secondValue"
    }

    encoded = msgpack_encode(custom_object)
    assert encoded == bytes(expected_array_like)

    decoded = msgpack_decode(encoded)
    assert decoded == custom_object


def test_encode_and_decode_instance():
    @dataclass
    class Test:
        firstKey: str
        secondKey: str

        def method(self):
            pass

    custom_object = Test("firstValue", "secondValue")
    encoded = msgpack_encode(custom_object)

    assert encoded == bytes(expected_array_like)

    complex_custom_object_with_class = {
        "foo": custom_object,
        "bar": {
            "foo": "bar"
        }
    }

    complex_custom_object_with_dict = {
        "foo": {
            "firstKey": "firstValue",
            "secondKey": "secondValue"
        },
        "bar": {
            "foo": "bar"
        }
    }

    encoded_with_dict = msgpack_encode(complex_custom_object_with_dict)
    encoded_with_class = msgpack_encode(complex_custom_object_with_class)

    assert encoded_with_dict == encoded_with_class

    decoded_with_dict = msgpack_decode(encoded_with_dict)

    assert complex_custom_object_with_dict == decoded_with_dict
