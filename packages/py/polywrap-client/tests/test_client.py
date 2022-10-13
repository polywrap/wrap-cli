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


async def test_invoke_bignumber_1arg_and_1prop():
    client = PolywrapClient()
    # BigNumber wrapper schema - https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)
    args = {
        "arg1": "123", # The base number
        "obj": {
            "prop1": "1000", # multiply the base number by this factor
        }
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)
    result = await client.invoke(options)
    print(result)
    assert result.result == "123000"


async def test_invoke_bignumber_with_2args_and_2props():
    client = PolywrapClient()
    # BigNumber wrapper schema - https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)
    args = {
        "arg1": "123123",
        "arg2": "4",
        "obj": {
            "prop1": "1000",
           "prop2": "4"
        }
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)
    result = await client.invoke(options)
    print(result)
    assert result.result == str(123123*4*1000*4)


