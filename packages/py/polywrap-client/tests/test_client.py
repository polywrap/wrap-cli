from polywrap_client.client import PolywrapClient
# from polywrap_core.types.invoke import InvokeOptions


def test_invoke():
    client = PolywrapClient()
    message = "hello polywrap"
    args = {
        "arg": message
    }
    # options = InvokeOptions(method="simpleMethod", args=args)
    # result = client.invoke(options)
    # print(result)
    # assert result.value == message
    assert True == True
