from polywrap_plugin import PluginPackage
from .wrap import *


class SampleModule(Module):
    def sample_method(self, args: ArgsSampleMethod, client: object, env: None):
        return f"{args['data']} from sample_method"


def sample_plugin() -> PluginPackage:
    return PluginPackage(
        module=SampleModule(None),
        manifest=manifest,
    )