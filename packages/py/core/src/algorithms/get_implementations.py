from typing import List

from .apply_redirects import apply_redirects
from ..types import InterfaceImplementations, Uri


def get_implementations(
    api_interface_uri: Uri, interfaces: List[InterfaceImplementations], redirects=None
) -> List[Uri]:
    if redirects is None:
        redirects = []

    def add_unique_result(uri: Uri, result: List[Uri]):
        if not uri in result:
            result.append(uri)

    def add_all_implementations_from_implementations_array(
        implementations_array: List[InterfaceImplementations],
        api_interface_uri: Uri,
    ) -> List[Uri]:
        result = []
        for interface_implementations in implementations_array:
            fully_resolved_uri = (
                apply_redirects(interface_implementations.interface, redirects)
                if redirects
                else interface_implementations.interface
            )

            if fully_resolved_uri == api_interface_uri:
                for implementation in interface_implementations.implementations:
                    add_unique_result(implementation, result)
        return result

    final_uri = api_interface_uri
    if redirects:
        final_uri = apply_redirects(api_interface_uri, redirects)

    result = add_all_implementations_from_implementations_array(interfaces, final_uri)

    return result
