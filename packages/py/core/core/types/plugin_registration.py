from __future__ import annotations

from dataclasses import dataclass

from . import PluginPackage, Uri


@dataclass(slots=True, kw_only=True)
class PluginRegistration:
    uri: Uri
    plugin: PluginPackage
