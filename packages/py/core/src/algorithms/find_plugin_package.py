from typing import Union, List

from ..types import Uri, PluginPackage, PluginRegistration


def find_plugin_package(uri: Uri, plugins: List[PluginRegistration]) -> Union[PluginPackage, None]:
    plugin_redirect = next(filter(lambda x: Uri.equals(x.uri, uri), plugins), None)
    return plugin_redirect.plugin if plugin_redirect else None
