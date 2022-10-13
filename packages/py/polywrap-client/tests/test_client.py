from pathlib import Path

from polywrap_client import PolywrapClient
from polywrap_core import Uri, InvokerOptions
from polywrap_uri_resolvers import BaseUriResolver, SimpleFileReader

from polywrap_client.client import PolywrapClientConfig


async def test_invoke():
    client = PolywrapClient()
    uri = Uri(
        f'fs/{Path(__file__).parent.joinpath("cases", "simple-invoke", "wrap.wasm").absolute()}'
    )
    args = {"arg": "hello polywrap"}
    options = InvokerOptions(
        uri=uri, method="simpleMethod", args=args, encode_result=False
    )
    result = await client.invoke(options)

    assert result.result == args["arg"]


async def test_subinvoke():
    uri_resolver = BaseUriResolver(
        file_reader=SimpleFileReader(),
        redirects={
            Uri("ens/add.eth"): Uri(
                f'fs/{Path(__file__).parent.joinpath("cases", "subinvoke", "wrap-subinvoke.wasm").absolute()}'
            ),
        },
    )

    client = PolywrapClient(config=PolywrapClientConfig(
        envs=[], resolver=uri_resolver
    ))
    uri = Uri(
        f'fs/{Path(__file__).parent.joinpath("cases", "subinvoke", "wrap-invoke.wasm").absolute()}'
    )
    args = {"a": 1, "b": 2}
    options = InvokerOptions(
        uri=uri, method="add", args=args, encode_result=False
    )
    result = await client.invoke(options)

    assert result.result == "1 + 2 = 3"

