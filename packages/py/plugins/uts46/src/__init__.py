from __future__ import annotations
from .wrap_man import Module, manifest

# TODO: uts46 python equivalent

class Uts46Plugin(Module):
    def to_ascii(input: InputToAscii) -> str:
        return uts46.to_ascii(input.value)
    
    def to_unicode(input: InputToUnicode) -> str:
        return uts46.to_unicode(input.value)
    
    def convert(input: InputConvert) -> ConvertResult:
        return uts46.convert(input.value)

def uts46_plugin(opts: Uts46PluginConfig):
    return {
        Uts46Plugin(opts),
        manifest
    }

plugin = uts46_plugin
