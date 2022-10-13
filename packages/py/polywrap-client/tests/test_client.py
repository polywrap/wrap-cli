from pathlib import Path

from polywrap_client import PolywrapClient
from polywrap_core import Uri, InvokerOptions


async def test_invoke():
    client = PolywrapClient()
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrap.wasm").absolute()}')
    args = {
        "arg": "hello polywrap"
    }
    options = InvokerOptions(uri=uri, method="simpleMethod", args=args, encode_result=False)
    result = await client.invoke(options)

    assert result.result == args["arg"]


async def test_invoke_bignumber():
    client = PolywrapClient()

    # BigNumber wrapper schema
    # https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)

    args = {
        "arg1": '2',
        "arg2": '333333',

        "obj": 2 # This line gives error : 
        #InvokeResult(result=None, error=WasmAbortError("
        # WasmWrapper: Wasm module aborted execution\n            
        # URI:\n           
        # Method:\n            
        # Args:\n            
        # Message: __wrap_abort: Property must be of type 'map'. Found 'int'.\n
        #   Context: Deserializing module-type: method\n
        #     at obj: Types.BigNumberArg >> type found, reading property\n
        #       at obj: unknown >> searching for property type\n
        # File: ~lib/@polywrap/wasm-as/msgpack/ReadDecoder.ts\nLocation: [277,5]"))
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)

    print(options)

    result = await client.invoke(options)
    print(result)
    assert result.result == args["arg1"]



