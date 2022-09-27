from dataclasses import dataclass
from re import L

from polywrap_msgpack import sanitize

from polywrap_msgpack import msgpack_encode, msgpack_decode

import pytest
from typing import Any, List


def test_encode_and_decode_object(expected_array_like):
    custom_object = {
        "firstKey": "firstValue",
        "secondKey": "secondValue"
    }

    encoded = msgpack_encode(custom_object)
    assert encoded == bytes(expected_array_like)

    decoded = msgpack_decode(encoded)
    assert decoded == custom_object


def test_encode_and_decode_instance(expected_array_like):
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
    assert sanitize("https://docs.polywrap.io/") == "https://docs.polywrap.io/"

def test_sanitize_simple_list_returns_simple_list():
    assert  sanitize([1]) == [1]

def test_sanitize_empty_list_returns_empty_list():
    assert sanitize([]) == []

def test_sanitize_long_list_returns_long_list():
    assert sanitize([2,55,1234,6345]) == [2,55,1234,6345] 

def test_sanitize_complex_list_returns_list(complex_list):
    assert sanitize(complex_list) == complex_list

def test_sanitize_nested_list_returns_nested_list(nested_list):
    assert sanitize(nested_list) == nested_list 

def test_sanitize_set_returns_list(set1):
    # Remember sets automatically reorganize the contents of the object
    # meaning {'bob', 'alice'} might be stored as {'alice','bob'} in memory
    assert type(sanitize(set1)) == list

def test_sanitize_set_returns_list_with_all_items_of_the_set():
    set1 = {'alice','bob','john','megan'}
    sanitized = sanitize({'alice','bob','john','megan'})
    r = []       
    [r.append(True) if item in sanitized else r.append(False) for item in set1]
    assert False not in r

def test_sanitize_set_returns_list_of_same_length(set1):
    assert len(sanitize(set1)) == len(set1)

def test_sanitize_complex_number_returns_string():
    assert sanitize(3 + 5j) == "(3+5j)"
    assert sanitize(0 + 9j) == "9j"

def test_sanitize_simple_dict_returns_sanitized_values(simple_dict):
    assert sanitize(simple_dict) == simple_dict

def test_sanitize_object_with_slots_attributes_returns_dict_instead():
    class Example():
        __slots__ = ("slot_0", "slot_1")
        def __init__(self):
            self.slot_0 = "zero"
            self.slot_1 = "one"
    s = Example()
    assert sanitize(s) == {'slot_0':'zero','slot_1':'one'}


def test_sanitize_single_tuple_returns_list():
    # To create a tuple with only one item, you have add a comma after the item, 
    # otherwise Python will not recognize the variable as a tuple.
    assert type(sanitize((8,))) == list
    assert sanitize((8,)) == [8] 

def test_sanitize_long_tuple_returns_list():
    assert sanitize((2,3,6)) == [2,3,6] 

def test_sanitize_nested_tuples_returns_nested_list(nested_tuple, nested_list):
    nested_tuple = (23, ((0.123,'dog'), 'cat'), 'boat', ('moon', True))
    nested_list = [23, [[0.123,'dog'], 'cat'], 'boat', ['moon', True]]
    assert sanitize(nested_tuple) == nested_list

# Tests that are not passing

def test_sanitize_complex_dict_returns_sanitized_values():
    complex_dict = {'name': ['John', 'Doe'],
        'position':[-0.34478,12.98453],
        'color': 'green',
        'age':33,
        'origin':(0,0),
        'is_online': True,
        'pet': None,
        'friends': {'bob','alice','megan','john'} }
    sanitized_complex_dict = {'name': ['John', 'Doe'],
        'position':[-0.34478,12.98453],
        'color': 'green',
        'age':33,
        'origin':[0,0],
        'is_online': True,
        'pet': None,
        'friends': ['bob','alice','megan','john'] }
    assert sanitize(complex_dict) == sanitized_complex_dict


# WIP Tests

# def test_sanitize_dict_returns_xxx():
#     dictionary = {'key1': 'value1'}
#     assert sanitize(dictionary) == 
