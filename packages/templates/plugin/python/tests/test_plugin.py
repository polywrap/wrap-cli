from hypothesis import given, strategies as st

from sample import sample_plugin

@given(st.text())
async def test_sample_method(s: str):
    plugin = sample_plugin()
    wrapper = plugin.create_wrapper()
    res = wrapper.invoke(
        uri="plugin/sample-plugin",
        method="sample_method",
        args={"data": s}
    )

    assert not res.encoded
    assert res.result == f"{s} from sample_method"