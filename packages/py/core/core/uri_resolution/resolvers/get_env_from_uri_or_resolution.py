from __future__ import annotations
from typing import Union

from ...types import Uri, Client, Env
from ..core import UriResolutionStack

def get_env_from_uri_or_resolution_stack(
    uri: Uri, resolution_path: UriResolutionStack, client: Client
) -> Union[Env, None]:
    env = client.get_env_by_uri(uri, {})

    if env:
        return env

    for uri_resolution_info in resolution_path:
        env = client.get_env_by_uri(uri_resolution_info.source_uri, {})
        if env:
            return env

    return None
