from typing import Any

from core import (
    Client,
    PluginModule,
    PluginPackageManifest,
    Uri,
)


class PluginTestModule(PluginModule):
    def test_query(_input: Any, _client: Client) -> int:
        return 5

    async def test_mutation(_input: Any, _client: Client) -> bool:
        return True


def test_sanity_plugin():
    plugin = PluginTestModule({})

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
    assert plugin
    assert hasattr(plugin, 'test_mutation')
