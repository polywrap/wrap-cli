from hypothesis import given, strategies as st

from polywrap_core import InvokeOptions

from sample import sample_plugin

@given(st.text())
async def test_sample_method(s: str):
    plugin = sample_plugin()
    wrapper = await plugin.create_wrapper()
    res = await wrapper.invoke(InvokeOptions(
        uri="plugin/sample-plugin",
        method="sample_method",
        args={"data": s}
    ), NotImplemented)

    assert not res.encoded
    assert res.result == f"{s} from sample_method"