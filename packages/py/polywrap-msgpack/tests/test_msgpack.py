from dataclasses import dataclass

from polywrap_msgpack import sanitize

from polywrap_msgpack import msgpack_encode, msgpack_decode

import pytest

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


def test_generic_map_decode():
    encoded = b'\xc7+\x01\x82\xa8firstKey\xaafirstValue\xa9secondKey\xabsecondValue'
    decoded = msgpack_decode(encoded)

    assert decoded == {'firstKey': 'firstValue', 'secondKey': 'secondValue'}

# Passing Tests

def test_sanitize_str_returns_same_str():
    assert sanitize("string input") == "string input"

def test_sanitize_simple_list_returns_simple_list():
    assert [1] == sanitize([1])

def test_sanitize_long_list_returns_long_list():
    assert [2,55,1234,6345] == sanitize([2,55,1234,6345])

def test_sanitize_complex_list_returns_list():
    complex_list = [1, 'foo', 'bar', 0.123, True, None]
    assert complex_list == sanitize(complex_list)

def test_sanitize_nested_list_returns_nested_list():
    nested_list = [23, [[0.123,'dog'], 'cat'], 'boat', ['moon', True]]
    assert nested_list == sanitize(nested_list)

# Tests that are not passing
def test_sanitize_single_tuple_returns_list():
    assert sanitize((8)) == [8] 

def test_sanitize_long_tuple_returns_list():
    assert sanitize((2,3,6)) == [2,3,6] 

def test_sanitize_nested_tuples_returns_nested_list():
    nested_tuple = (23, ((0.123,'dog'), 'cat'), 'boat', ('moon', True))
    assert sanitize(nested_tuple) == nested_tuple
# WIP Tests

def test_sanitize_dict_returns_sanitized_values():
    complex_dict = {'name': ['John', 'Doe'],
        'position':[-0.34478,12.98453],
        'color': 'green',
        'age':33,
        'origin':(0,0)}
    assert sanitize(complex_dict) == complex_dict




# def test_sanitize_dict_returns_xxx():
#     dictionary = {'key1': 'value1'}
#     assert sanitize(dictionary) == 
    

