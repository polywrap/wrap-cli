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

async def test_invoke_bignumber_with_1arg_and_2props():
    client = PolywrapClient()
    # BigNumber wrapper schema - https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)
    args = {
        "arg1": "123123",
        "obj": {
            "prop1": "1000",
           "prop2": "4"
        }
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)
    result = await client.invoke(options)
    print(result)
    assert result.result == str(123123*1000*4)

async def test_invoke_bignumber_with_2args_and_1prop():
    client = PolywrapClient()
    # BigNumber wrapper schema - https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)
    args = {
        "arg1": "123123",
        "obj": {
            "prop1": "1000",
           "prop2": "444"
        }
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)
    result = await client.invoke(options)
    print(result)
    assert result.result == str(123123*1000*444)

async def test_invoke_bignumber_with_2args_and_2props():
    client = PolywrapClient()
    # BigNumber wrapper schema - https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)
    args = {
        "arg1": "123123",
        "arg2": "555",
        "obj": {
            "prop1": "1000",
           "prop2": "4"
        }
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)
    result = await client.invoke(options)
    print(result)
    assert result.result == str(123123*555*1000*4)



async def test_invoke_bignumber_with_2args_and_2props_floats():
    client = PolywrapClient()
    # BigNumber wrapper schema - https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)
    args = {
        "arg1": "123.123",
        "arg2": "55.5",
        "obj": {
            "prop1": "10.001",
           "prop2": "4"
        }
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)
    result = await client.invoke(options)
    print(result)
    assert result.result == str(123.123*55.5*10.001*4)


async def test_invoke_bignumber_with_2args_and_2props_complex_numbers():
    client = PolywrapClient()
    # BigNumber wrapper schema - https://wrappers.io/v/ipfs/Qme2YXThmsqtfpiUPHJUEzZSBiqX3woQxxdXbDJZvXrvAD
    uri = Uri(f'fs/{Path(__file__).parent.joinpath("cases", "wrapperBigNumber.wasm").absolute()}')
    print(Uri)
    args = {
        # Question: Should bignumber work with complex numbers? 
        "arg1": "3j",
        "arg2": "5",
        "obj": {
            "prop1": "2",
           "prop2": "4"
        }
    }
    options = InvokerOptions(uri=uri, method="method", args=args, encode_result=False)
    result = await client.invoke(options)
    print(result)
    # Question: Should bignumber work with complex numbers? 
    assert result.result == str(3j*55*2*4)