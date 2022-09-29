from polywrap_wasm import WasmWrapper


def test_invoke():
    wrapper = WasmWrapper()
    result = wrapper.invoke()
    assert result == 3
