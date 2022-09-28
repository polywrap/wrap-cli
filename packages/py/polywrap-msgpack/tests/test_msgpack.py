from dataclasses import dataclass
from re import L

from polywrap_msgpack import sanitize

from polywrap_msgpack import msgpack_encode, msgpack_decode

import pytest
from typing import Any, List

# ENCODING AND DECODING

def test_encode_and_decode_object(list_of_ints):
    custom_object = {
        "firstKey": "firstValue",
        "secondKey": "secondValue"
    }

    encoded = msgpack_encode(custom_object)
    assert encoded == bytes(list_of_ints)

    decoded = msgpack_decode(encoded)
    assert decoded == custom_object


def test_encode_and_decode_instance(list_of_ints):
    @dataclass
    class Test:
        firstKey: str
        secondKey: str

        def method(self):
            pass

    custom_object = Test("firstValue", "secondValue")
    encoded = msgpack_encode(custom_object)

    assert encoded == bytes(list_of_ints)

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

# STRINGS

def test_sanitize_str_returns_same_str():
    assert sanitize("https://docs.polywrap.io/") == "https://docs.polywrap.io/"

#def test_sanitized_polywrap_ens_uri(UriPath):
#    pass

# LISTS

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

# COMPLEX NUMBERS

def test_sanitize_complex_number_returns_string():
    assert sanitize(3 + 5j) == "(3+5j)"
    assert sanitize(0 + 9j) == "9j"

def test_sanitize_simple_dict_returns_sanitized_values(simple_dict):
    assert sanitize(simple_dict) == simple_dict

# SLOTS

def test_sanitize_object_with_slots_attributes_returns_dict_instead(object_with_slots_attributes, object_with_slots_sanitized):
    assert sanitize(object_with_slots_attributes) == object_with_slots_sanitized

# TUPLES

def test_sanitize_single_tuple_returns_list(single_tuple):
    # To create a tuple with only one item, you have add a comma after the item, 
    # otherwise Python will not recognize the variable as a tuple.
    assert type(sanitize(single_tuple)) == list
    assert sanitize(single_tuple) == [8] 

def test_sanitize_long_tuple_returns_list():
    assert sanitize((2,3,6)) == [2,3,6] 

def test_sanitize_nested_tuples_returns_nested_list(nested_tuple, nested_list):
    assert sanitize(nested_tuple) == nested_list


# SETS

def test_sanitize_set_returns_list(set1):
    # Remember sets automatically reorganize the contents of the object
    # meaning {'bob', 'alice'} might be stored as {'alice','bob'} in memory
    assert type(sanitize(set1)) == list

def test_sanitize_set_returns_list_with_all_items_of_the_set(set1, set2):
    sanitized = sanitize(set1)
    r = []       
    [r.append(True) if item in sanitized else r.append(False) for item in set1]
    assert False not in r
    
    sanitized = sanitize(set2)
    r = []       
    [r.append(True) if item in sanitized else r.append(False) for item in set2]
    assert False not in r

def test_sanitize_set_returns_list_of_same_length(set1):
    assert len(sanitize(set1)) == len(set1)


def test_sanitize_complex_dict_returns_sanitized_values():
    # This test is not passing because when we sanitize a set, the contents are shuffled around.
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

# DATA CLASSES

def test_sanitize_dataclass_object_returns_dict(dataclass_object1, dataclass_object1_as_dict):
    assert sanitize(dataclass_object1) == dataclass_object1_as_dict

def test_sanitize_list_of_dataclass_objects_returns_list_of_dicts(dataclass_object1, dataclass_object2):
    assert sanitize([dataclass_object1, dataclass_object2]) == [dataclass_object1.__dict__, dataclass_object2.__dict__]

# DATA CLASSES WITH SLOTS

def test_sanitize_dataclass_objects_with_slots_returns_dict(dataclass_object_with_slots1, dataclass_object_with_slots1_sanitized):
    print(dataclass_object_with_slots1.__slots__)
    sanitize(dataclass_object_with_slots1)
    assert sanitize(dataclass_object_with_slots1) == dataclass_object_with_slots1_sanitized

def test_sanitize_list_of_dataclass_objects_with_slots_returns_list_of_dicts(dataclass_object_with_slots1, dataclass_object_with_slots2,
                                                                             dataclass_object_with_slots1_sanitized, dataclass_object_with_slots2_sanitized):
    assert sanitize([dataclass_object_with_slots1, dataclass_object_with_slots2]) == [dataclass_object_with_slots1_sanitized, dataclass_object_with_slots2_sanitized]
