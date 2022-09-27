
from typing import Dict
from pytest import fixture
from dataclasses import dataclass

@fixture
def object_with_slots_attributes():
    class Example():
        __slots__ = ("slot_0", "slot_1")
        def __init__(self):
            self.slot_0 = "zero"
            self.slot_1 = "one"
    s = Example()
    return s

@dataclass
class DataClassObjectWithoutSlots():
    address: str
    name: str
    symbol: str
    decimals: int
    _totalSupply: int

    def total_supply(self) -> float:
        return self._totalSupply / (10**self.decimals)

@fixture 
def dataclass_object_without_slots():
    return DataClassObjectWithoutSlots('0x8798249c2e607446efb7ad49ec89dd1865ff4272-IOU',
         "SushiBar", "xSUSHI", 18, 50158519600425129140904955)

@fixture
def dataclass_object_without_slots_as_dict():
    {'address': '0x8798249c2e607446efb7ad49ec89dd1865ff4272-IOU', 'name': 'SushiBar', 'symbol': 'xSUSHI', 'decimals': 18, '_totalSupply': 50158519600425129140904955}



@dataclass
class DataClassObjectWithSlots():
    address: str
    name: str
    symbol: str
    decimals: int
    _totalSupply: int

    def total_supply(self) -> float:
        return self._totalSupply / (10**self.decimals)

@fixture 
def dataclass_object_with_slots():
    return DataClassObjectWithoutSlots('0x8798249c2e607446efb7ad49ec89dd1865ff4272-IOU',
         "SushiBar", "xSUSHI", 18, 50158519600425129140904955)

@fixture 
def expected_array_like(): 
    return [
    130, 168, 102, 105, 114, 115, 116, 75,
    101, 121, 170, 102, 105, 114, 115, 116,
    86, 97, 108, 117, 101, 169, 115, 101,
    99, 111, 110, 100, 75, 101, 121, 171,
    115, 101, 99, 111, 110, 100, 86, 97,
    108, 117, 101
]

@fixture
def complex_list():
    return [1, 'foo', 'bar', 0.123, True, None]

@fixture 
def nested_list():
    return [23, [[0.123,'dog'], 'cat'], 'boat', ['moon', True]]

@fixture 
def single_tuple():
    return (8,)

@fixture
def nested_tuple():
    return (23, ((0.123,'dog'), 'cat'), 'boat', ('moon', True))

@fixture 
def set1():
    return {'alice','bob','john','megan'}

@fixture 
def set2():
    return {'alice',9,5.23,True}

@fixture
def simple_dict ():
    return {'name': 'John'}


@fixture(autouse=True)
def sample_defiwrapper_response():
    defiwrapper_query_output_sample: Dict[Any, Any] = {
        "data": {
            "tokenComponentBalance": {
            "token": {
                "token": {
                "address": "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
                "name": "SushiBar",
                "symbol": "xSUSHI",
                "decimals": 18,
                "totalSupply": "50158519600425129140904955"
                },
                "balance": "1",
                "values": [
                {
                    "currency": "usd",
                    "price": "1.6203616386851516097715521019609973314166017363583125125177612507801356287430182843428533667860466354657854886395943448616499753981626528432008089076498023",
                    "value": "1.620361638685151609771552101960997331416601736358312512517761250780135628743018284342853366786046635465785488639594344861649975398162652843200808907649802334"
                }
                ]
            },
            "unresolvedComponents": 0,
            "components": [
                {
                "token": {
                    "token": {
                    "address": "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
                    "name": "SushiToken",
                    "symbol": "SUSHI",
                    "decimals": 18,
                    "totalSupply": "244512668851294512182250751"
                    },
                    "balance": "1.3391418501530178593153323156702457284434725093870351343121993808100294452421638713577300551950798640213103211897473924476446077670765725976866189319419854",
                    "values": [
                    {
                        "currency": "usd",
                        "price": "1.21",
                        "value": "1.620361638685151609771552101960997331416601736358312512517761250780135628743018284342853366786046635465785488639594344861649975398162652843200808907649802334"
                    }
                    ]
                },
                "unresolvedComponents": 0,
                "components": []
                }
            ]
            },
            "apy": "N/A",
            "apr": "N/A",
            "isDebt": False,
            "claimableTokens": []
        }
        }
    return defiwrapper_query_output_sample