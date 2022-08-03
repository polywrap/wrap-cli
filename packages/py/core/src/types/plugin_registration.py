from __future__ import annotations
from dataclasses import dataclass
from typing import List

from . import Uri


@dataclass
class PluginRegistration:
    uri: str
    plugin: PluginPackage


def sanitize_plugin_registrations(input: List[PluginRegistration]) -> List[PluginRegistration]:
    output = []
    for definition in input:
        uri = Uri(definition.uri)
        output.append(PluginRegistration(uri=uri, plugin=definition.plugin))
    return output
