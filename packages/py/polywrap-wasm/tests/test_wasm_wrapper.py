from polywrap_wasm import WasmWrapper, InvokeOptions


def test_invoke():
    wrapper = WasmWrapper()
    message = "hello polywrap"
    args = {
        "arg": message
    }
    options = InvokeOptions(method="sampleMethod", args=args)
    result = wrapper.invoke(options)
    print(result)
    assert result.value == message
