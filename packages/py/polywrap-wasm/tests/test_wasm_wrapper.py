from polywrap_wasm.wasm_package import FileReader
from polywrap_wasm.wasm_wrapper import WasmWrapper
from polywrap_core.types.invoke import InvokeOptions
from polywrap_core.types.uri import Uri


def test_invoke():
    file_reader = FileReader()
    wrapper = WasmWrapper(file_reader)
    
    message = "hey"
    args = {
        "arg": message
    }
    options = InvokeOptions(uri=Uri("fs/./build"), method="simpleMethod", args=args)
    result = wrapper.invoke(options)
    assert result == message
