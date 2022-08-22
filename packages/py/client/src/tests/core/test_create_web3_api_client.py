import pytest 

from ...create_web3_api_client import PluginConfigs, create_web3_api_client


async def test_create_web3_api_client_throw_not_installed():
    with pytest.raises(Exception, match = "Requested plugin \"nonExistantPlugin\" is not a supported createWeb3ApiClient plugin."):
        class NonExistantPlugin:
            def __init__(self):
                self.nonExistantPlugin = {}
        client_params = NonExistantPlugin()

        await create_web3_api_client(client_params)
