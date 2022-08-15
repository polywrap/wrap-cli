from typing import Any, Awaitable

from .. import (
    Client,
    Plugin,
    PluginModule,
    PluginPackageManifest,
    Uri,
)


class PluginTest(Plugin):
    @classmethod
    def get_module(cls) -> PluginModule:
        return PluginTestModule({})


class PluginTestModule(PluginModule):
    def test_query(_input: Any, _client: Client) -> int:
        return 5

    async def test_mutation(_input: Any, _client: Client) -> Awaitable[bool]:
        return True


def test_sanity_plugin():
    plugin = PluginTest()
    module = plugin.get_module()

    test_plugin_manifest = PluginPackageManifest(
        schema="""
            type Module {
                testQuery: Number!
                testMutation: Boolean!
            }
        """,
        implements=[Uri("host2/path2")],
    )

    assert len(test_plugin_manifest.implements) == 1
    assert module
    assert hasattr(module, 'test_mutation')
