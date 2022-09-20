from __future__ import annotations

from dataclasses import dataclass

from .plugin import PluginPackage
from .uri import Uri


@dataclass(slots=True, kw_only=True)
class PluginRegistration:
    uri: Uri
    plugin: PluginPackage
