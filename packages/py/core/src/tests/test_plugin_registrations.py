from .. import PluginRegistration, Uri, sanitize_plugin_registrations


def test_return_empty_array_if_given():
    plugins = sanitize_plugin_registrations([])
    assert plugins == []


def test_return_plugin_from_plugin_definitions():
    plugins = sanitize_plugin_registrations(
        [
            PluginRegistration(
                uri="w3://w3/api",
                plugin=None,
            )
        ]
    )
    assert plugins == [
        PluginRegistration(
            uri=Uri("w3://w3/api"),
            plugin=None,
        )
    ]
