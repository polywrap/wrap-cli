from json import dumps
from typing import Dict, List

from ..types import Uri, UriRedirect


def apply_redirects(uri: Uri, redirects: List[UriRedirect]) -> Uri:
    """
    Keep track of past redirects (from_uri -> to_uri) to find the final uri.

    :param Uri uri:
    :param List[UriRedirect] redirects:
    :return Uri:
    """

    def _throw_error(message: str, redirect_from_to_map: Dict[str, Uri]):
        serialize_message = {}
        for key in redirect_from_to_map:
            serialize_message[key] = redirect_from_to_map[key].uri
        raise ValueError(f"""{message}\nResolution Stack: {dumps(serialize_message)}""")

    redirect_from_to_map = {}
    for redirect in redirects:
        if not redirect.from_uri:
            _throw_error(
                f"Redirect missing the from_uri property.\nEncountered while resolving {uri.uri}",
                redirect_from_to_map,
            )

        if redirect_from_to_map.get(redirect.from_uri.uri):
            continue

        redirect_from_to_map[redirect.from_uri.uri] = redirect.to_uri

    final_uri = uri

    visited_uris = {}
    while redirect_from_to_map.get(final_uri.uri):
        visited_uris[final_uri.uri] = True
        final_uri = redirect_from_to_map[final_uri.uri]

        if visited_uris.get(final_uri.uri):
            _throw_error(f"Infinite loop while resolving URI '{uri}'.", redirect_from_to_map)
    return final_uri
