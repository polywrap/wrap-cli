from .. import Uri, InterfaceImplementations
from ..types import sanitize_interface_implementations


def test_return_empty_if_empty_already_passed():
    interfaces = sanitize_interface_implementations([])
    assert interfaces == []


def test_returns_interfaces_from_interfaces_definitions():
    interfaces = sanitize_interface_implementations(
        [InterfaceImplementations(interface="w3://w3/interface", implementations=["w3://w3/api1", "w3://w3/api2"])]
    )

    assert interfaces == [
        InterfaceImplementations(
            interface=Uri("w3://w3/interface"), implementations=[Uri("w3://w3/api1"), Uri("w3://w3/api2")]
        )
    ]
